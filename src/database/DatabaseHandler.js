import {
  get,
  getDatabase,
  child,
  ref,
  update,
  set,
  onValue,
  remove,

} from "firebase/database";
import { initializeApp,getApps,getApp } from "firebase/app";

const firebaseConfig = {

  apiKey: "AIzaSyCiGtA9NHnFJ4TN1PxAbDgHl7UXfcjMoRM",

  authDomain: "scheduleasy-d17f5.firebaseapp.com",

  projectId: "scheduleasy-d17f5",

  storageBucket: "scheduleasy-d17f5.appspot.com",

  messagingSenderId: "645588070028",

  appId: "1:645588070028:web:b8d041823b7e552c9995a9"

};
function generateId() {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var token = "";
  for (var i = 0; i < 28; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
export class DatabaseHandler {
  static database = getDatabase();

  static registerUserData(userId, userName, email, birthDate, majority) {
    set(ref(this.database, "users/" + userId), {
      userName: userName,
      email: email,
      birthDate: birthDate,
      majority: majority,
    });
    set(ref(this.database, "userNames/" + userName), { uid: userId });
  }


  static createEvent(allEventInfo) {
    //participant nodes is being pushed under the eventId node. it must be deleted

    const event_Id = generateId();
    console.log(allEventInfo);
    const db_event_node = {};
    const db_event_participants = {};

    const db_options = {};

    allEventInfo.options.forEach((opt, index) => db_options[index] = opt);
    allEventInfo.options = db_options;
    console.log(allEventInfo.participants)
    set(ref(this.database, "events/" + event_Id), allEventInfo);

    set(
      ref(
        this.database,
        "userEvents/" + allEventInfo.creatorName + "/" + event_Id
      ),
      true
    );
    db_event_participants[allEventInfo.creatorName] = true;
    Object.values(allEventInfo.participants).forEach((participant) => {
      db_event_participants[participant] = true;
      set(
        ref(this.database, "userEvents/" + participant + "/" + event_Id),
        true
      );
    });

    set(
      ref(this.database, "participantsOfEvent/" + event_Id),
      db_event_participants
    ); // Wrong must be {huxies:true} but {0:true}
    //it could be addUserToEvent(userName) func to call here to be more modular for the incoming invitations
  }

  static async getUserVote(eventId,username){
      var res =  (await (get(ref(this.database,"participantsOfEvent/"+eventId +"/"+username)))).val()
      var returnedList = [];
      if (res!=null){
        res.forEach((vote)=> {
          if(vote != ""){
            returnedList.push(vote);
          }
        })
      }
      
      return returnedList
    }

  static async getUserName(userId) {
    let userName = (
      await get(child(ref(this.database), `users/${userId}/userName`))
    ).val();
    console.log(userName, "dbhandler");
    return userName;
  }

  static async isUserExist(userName) {
    let exists = (
      await get(child(ref(this.database), `userNames/${userName}`))
    ).val();
    if (exists === null) {
      return false;
    }
    return exists.uid; // it might return true take a look at later
  }

  static async getUserEventIds(userName) {
    let events = (
      await get(child(ref(this.database), `userEvents/${userName}`))
    ).val();
    return Object.keys(events);
  }

  static deleteEvent(eventId) {
    // Assuming that events are stored under 'events' node in the database
    const eventRef = ref(db, 'events/' + eventId);
    remove(eventRef)
      .then(() => {
        console.log("Event removed successfully");
      })
      .catch((error) => {
        console.error("Error removing event: ", error);
      });
  }


  static async getEventInfo(eventId) {
    const eventSnapshot = await get(child(ref(this.database), `events/${eventId}`));
    const eventInfo = eventSnapshot.val();
  
    if (eventInfo.privacy === "Public") {
      const participantsSnapshot = await get(child(ref(this.database), `userNames`));
      const participants = participantsSnapshot.val();
      eventInfo.participants = participants;
    } else {
      const participantsSnapshot = await get(child(ref(this.database), `participantsOfEvent/${eventId}`));
      const participants = participantsSnapshot.val();
      eventInfo.participants = participants;
    }
  
    eventInfo.id = eventId;
  
    return eventInfo;
  }
  
  static async listenEventOptions(eventId,setState) {
    onValue(ref(this.database, "events/" + eventId + "/options"), (snapshot) => {
      const data = snapshot.val();
      data.map((opt, index) => (opt["id"] = index));
      console.log(data);
      setState(data);
    });
  }
  static async setCustomDateOption(eventId,options,incomingOptions){
    var index = options.length
    
    for(var i in [...Array(incomingOptions.length).keys()]){
      console.log(i)
      await set(ref(this.database,"events/" + eventId + "/options/" + `${index + (+i)}`),incomingOptions[i])
    }

    
  }
  static async getUserEventInfos(userName) {
    // critical
    let event_ids = Object.keys(
      (await get(child(ref(this.database), `userEvents/${userName}`))).val()
    );
    let events_info = [];
    event_ids.forEach((eventId) =>
      events_info.push(this.getEventInfo(eventId))
    );
    ///events_info.forEach(event => console.log(event.title),"asd")
    return events_info;
  }

  static async leaveEvent(eventId, username) {
    set(
      ref(this.database, "participantsOfEvent/" + eventId + "/" + username),
      {}
    );
    set(ref(this.database, "userEvents/" + username + "/" + eventId), {});
  }

  static async endEvent(event_Id,optionId){
     set(ref(this.database,"events/"+ event_Id + "/isOpen"),false);
     set(ref(this.database,"events/"+ event_Id + "/endOptionId"),optionId);
  }

  static async submitVote(eventId, userName, votes) {
    for (const date of Object.keys(votes)) {
      console.log(`id : ${date} -> vote : ${votes[date]}`)
      await set(
        ref(
          this.database,
          "participantsOfEvent/" + eventId + "/" + userName + "/" + date
        ),
        votes[date]
      );
    }
  }

  static async getVotes(eventId) {
    let votes = (
      await get(child(ref(this.database), "participantsOfEvent/" + eventId))
    ).val();
    let comings = {};
    let Ncomings = {};
    let ifNeed = {};
    for (const user of Object.keys(votes)) {
      try {
        votes[user].forEach((opt, index) => {
          //console.log(opt,index);
          switch (opt) {
            case "Coming":
              try {
                comings[index].push(user);
              } catch {
                comings[index] = [user];
              }

              break;
            case "Not":
              try {
                Ncomings[index].push(user);
              } catch {
                Ncomings[index] = [user];
              }

              break;
            case "If need":
              try {
                ifNeed[index].push(user);
              } catch {
                ifNeed[index] = [user];
              }
          }
        });
      } catch {}
    }

    return { comings, Ncomings, ifNeed };
  }
}