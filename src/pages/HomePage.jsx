import React, { useState, useEffect } from "react";
import AuthContext from "../store/authContext";
import { Notification } from "../UI/Notification";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import { DatabaseHandler } from "../database/DatabaseHandler";
import Banner from "../UI/Banner";
import image from "../components/8f230a828c3f087b23a67360c21d9d5a.jpg";
import { get, child, ref } from "firebase/database";

const HomePage = (props) => {
  // too many renders!
  const onClickHandler = () => {
    <Link to="/eventPage"> </Link>;
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [privacyFilter, setPrivacyFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [isEventsEmpty, setIsEventsEmpty] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);
  const handlePrivacyFilterChange = (event) => {
    setPrivacyFilter(event.target.value);
  };
  useEffect(() => {
    const fetchEvents = async () => {
      const allEventsSnapshot = await get(child(ref(DatabaseHandler.database), 'events'));
      const allEvents = allEventsSnapshot.val();
    
      const filteredEvents = Object.entries(allEvents).reduce((filtered, [eventId, eventInfo]) => {
        if (
          eventInfo.privacy === 'Public' ||
          eventInfo.creatorName === userInfo.userName ||
          (eventInfo.participants && eventInfo.participants.includes(userInfo.userName))
        ) {
          filtered.push({ ...eventInfo, id: eventId });
        }
    
        return filtered;
      }, []);
    
      setEvents(filteredEvents);
      setIsEventsEmpty(filteredEvents.length === 0);
      setLoading(false);
    };
    
      fetchEvents();
 
      
    
  }, []);

 
  const filteredEvents = events.filter(event => {
    if (privacyFilter === 'all') return true;
    return event.privacy === privacyFilter;
  });
  return (
    <>
      {props.showGreetingMessage && userInfo !== null && (
        <Notification
          status="Succ"
          title={`Welcome ${userInfo.userName} !`}
          message="It's good to see you 👋"
          disappearEvents={[true, props.setShowGreetingMessage]}
        />
      )}

      {props.isLogged ? (
        <div>
          <div className="py-10">
            <header>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight text-gray-900"></h1>
              </div>
            </header>
            <main>
              <div className="max-w-2xl mx-auto sm:px-8 lg:px-16">
                <div className="px-4 py-8 sm:px-0">
                  <div className="flex justify-around">
                    <Link to="/createPoll">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-black bg-green-500 rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Create New Event
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300 mr-8 ml-8" />
                </div>
                <div className="relative flex justify-center mb-4">
                  <span className="px-3 bg-white text-lg font-medium text-gray-900">
                    Your Events
                  </span>
                </div>
              </div>

              <div className="my-4">
        <label className="mr-2" htmlFor="privacyFilter">Filter by privacy:</label>
        <select id="privacyFilter" value={privacyFilter} onChange={handlePrivacyFilterChange}>
          <option value="all">All</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </div>
              {loading ? (
                <Banner message={"Your events/meetings loading..."} />
              ) : (
                <ul
                  role="list"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 container"
                >
                  {!isEventsEmpty ? (
filteredEvents.map((event, index) => (
  <li key={index} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 cursor-pointer">
    <EventCard event={event} />
  </li>
))

                  ) : (
                    <p>You have no event yet.</p>
                  )}
                </ul>
              )}
            </main>
          </div>
        </div>
      ) : (
        <main>
          <div className="relative mt-16">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    className="h-full w-full object-cover"
                    src={image}
                    alt="People working on laptops"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 mix-blend-multiply" />
                </div>
                <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                  <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                    <span className="block text-white">
                      Schedule your all events
                    </span>
                    <span className="block text-gray-300">from one platform</span>
                  </h1>
                  <p className="mt-6 max-w-lg mx-auto text-center text-xl text-gray-300 sm:max-w-3xl">
                    By planning your events on our site, you will be able to
                    make quicker and faster decisions and avoid wasting time.
                  </p>
                  <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                    <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                      <Link
                        to="/registerPage"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-indigo-50 sm:px-8"
                      >
                        Sign Up
                      </Link>
                      <Link
                        to="/loginPage"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white bg-opacity-60 hover:bg-opacity-70 sm:px-8"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="flex justify-center mt-8 text-base text-gray-400 md:mt-18 md:order-1">
              &copy; 2023, Inc. All rights reserved.
            </p>
          </div>
        </main>
      )}
    </>
  );
};

export default HomePage;
