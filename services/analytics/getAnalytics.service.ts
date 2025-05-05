import { CHANNELS, IChannel } from "#constants/channels.js";
import Client from "#db/models/Client.js";
import ApiError from "#utils/api/ApiError.js";
import { MongoObjectId } from "#utils/mongoose/casters.js";

const getAnalyticsFromDB = async (
  clinic_id: string,
  startDate?: Date,
  endDate?: Date,
  channel: IChannel = CHANNELS.INSTAGRAM,
  groupBy = "day" // 'day' or 'month'
) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const dateFilter: Record<string, any> = {};

  if (start) {
    dateFilter.$gte = start;
  }

  if (end) {
    dateFilter.$lte = end;
  }

  const matchStage: Record<string, any> = {
    clinic_id: MongoObjectId(clinic_id),
  };

  if (start || end) {
    matchStage[`channels.${channel}.first_message_date`] = dateFilter;
  }

  // Define the date group format (day or month)
  const dateFormat =
    groupBy === "month"
      ? {
          $dateToString: {
            format: "%Y-%m",
            date: `$channels.${channel}.first_message_date`, // Direct access to the field
          },
        }
      : {
          $dateToString: {
            format: "%Y-%m-%d",
            date: `$channels.${channel}.first_message_date`, // Direct access to the field
          },
        };

  const analyticsPipeline = [
    {
      $match: matchStage,
    },
    {
      $project: {
        first_message_date: `$channels.${channel}.first_message_date`, // Direct access to the field
        phone_giving_date: `$channels.${channel}.phone_giving_date`, // Direct access to the field
        formattedDate: dateFormat,
      },
    },
    {
      $group: {
        _id: "$formattedDate", // Group by formatted date (either day or month)
        totalMessengers: { $sum: 1 },
        totalPhoneNumbersGiven: {
          $sum: {
            $cond: [
              { $ne: ["$phone_giving_date", null] }, // Ensure phone_giving_date is not null
              1,
              0,
            ],
          },
        },
      },
    },
    // {
    //   $sort: { _id: 1 }, // Sort by date (ascending)
    // },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalMessengers: 1,
        totalPhoneNumbersGiven: 1,
        phoneNumberGivingRatio: {
          $cond: {
            if: { $eq: ["$totalMessengers", 0] },
            then: 0,
            else: {
              $divide: ["$totalPhoneNumbersGiven", "$totalMessengers"],
            },
          },
        },
      },
    },
  ];

  const result = await Client.aggregate(analyticsPipeline);

  return result;
};

interface AnalyticsParams {
  clinic_id: string;
  startDate?: Date;
  endDate?: Date;
  channel: IChannel;
  groupBy: "day" | "month" | "hour" | "year";
}

export default async function getAnalytics({
  clinic_id,
  startDate,
  endDate,
  channel = CHANNELS.INSTAGRAM,
  groupBy = "day",
}: AnalyticsParams) {
  if (!clinic_id) {
    throw new ApiError(400, "clinic_id is required");
  }

  const analytics = await getAnalyticsFromDB(
    clinic_id,
    startDate,
    endDate,
    channel,
    groupBy
  );

  const total_messengers = analytics.reduce(
    (acc, curr) => acc + curr.totalMessengers,
    0
  );
  const total_phone_numbers_given = analytics.reduce(
    (acc, curr) => acc + curr.totalPhoneNumbersGiven,
    0
  );

  return {
    data_series: analytics,
    total_messengers,
    total_phone_numbers_given,
    total_phone_ratio:
      (total_phone_numbers_given ?? 0 / total_messengers).toFixed(2) * 1,
  };
}
