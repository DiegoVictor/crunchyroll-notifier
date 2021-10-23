export const sendSubscribeRequest = async ({ topic }: Anime) => {
  await sns.publish({
    Message: JSON.stringify({
      default: "",
      GCM: JSON.stringify({
        data: {
          type: "subscribeTopic",
          topic,
        },
      }),
    }),
    MessageStructure: "json",
    TopicArn: process.env.GENERAL_TOPIC_ARN,
  });
};
