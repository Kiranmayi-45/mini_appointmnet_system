const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const { sendMail } = require("../utils/mailer");
const dayjs = require("dayjs");

cron.schedule("* * * * *", async () => {
  const nowPlusOneHour = dayjs().add(1, "hour");

  const appts = await Appointment.find({
    status: "CONFIRMED",
    reminderSent: false,
  }).populate("user");

  for (let a of appts) {
    const apptTime = dayjs(`${a.date} ${a.startTime}`);

    if (apptTime.isBefore(nowPlusOneHour) && apptTime.isAfter(dayjs())) {
      await sendMail(
        a.user.email,
        "Appointment Reminder",
        `Reminder: Your appointment is at ${a.startTime} today`
      );

      a.reminderSent = true;
      await a.save();
    }
  }
});
