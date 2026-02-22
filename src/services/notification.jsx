import notifee, { TriggerType , RepeatFrequency} from '@notifee/react-native';

export default async function scheduleDailyNotification() {

  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.createTriggerNotification(
    // console.log(typeof(Date.now() + 10000)),
    {
      title: 'Heal App',
      body: 'Time to check your daily health update!',
      android: {
        channelId,
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 10000, // 10 seconds from now
      repeatFrequency: RepeatFrequency.DAILY,
    }
  );
}