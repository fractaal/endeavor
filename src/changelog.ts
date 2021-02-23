export default [
  {
    title: "🔥 Hotfix",
    text: "Version 3.6.1's navigation overhaul broke a couple of things (See course button in section view leads to blank page & Books don't load), they should now be fixed!"
  },
  {
    title: "🧭 Navigation Overhaul",
    text: "Knowing where you are was a bit difficult to do in Endeavor compared to eLearn. Not anymore!"
  },
  {
    title: "📱 UI Change",
    text: "The navigation overhaul merited a change in the user interface! The top bar is back, but it's sleek. You won't even know it's there!"
  },
  {
    title: "🔧 Bug Fixes",
    text: "Some backend bug fixes were made. I probably made them worse, though. Sorry in advance."
  },
  {
    title: "🔧 UI Fixes",
    text: "Weird window button placement on the login screen is now fixed!",
  },
  {
    title: "🔺 High CPU usage temporary fix",
    text: "The overdue animation (pulsing white border) caused high CPU usage, and is disabled. I'm thinking of an alternative panic animation, but for now, it's gone."
  }
] as {
  title: string;
  text: string;
}[]