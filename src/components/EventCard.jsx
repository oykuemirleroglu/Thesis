import { XIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../UI/DeleteModal";
import Modal from "../UI/Modal";

const EventCard = (props) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const status = "The date of this event has been set"
  // const handleSetShowDelete = () => {
  //   setShowDelete(!showDelete);
  // };

  const clickHandler = () => {
    setIsClicked(true);
  };

  if(props.event.options === undefined){
    props.event.options = []
  }
  if(props.event.participants === null || props.event.participants === undefined){
    props.event.participants = {}
  }
  return (
    <>
      {isClicked && (
        <DeleteModal eventId={props.event.id} setIsClicked={setIsClicked} />
      )}
      <div
        className="border"
        // onMouseEnter={handleSetShowDelete}
        // onMouseLeave={handleSetShowDelete}
      >
        {showDelete && (
          <button className="flex items-center" onClick={clickHandler}>
            <XIcon
              className="w-7 h-7 text-gray-400 hover:text-red-500"
              aria-hidden="true"
            />
          </button>
        )}
        
          <button className="w-full flex items-center justify-between mt-2">
            <div className="w-full flex items-center justify-between p-6 space-x-6">
            <button className="flex items-center" onClick={clickHandler}>
            <XIcon
              className="w-7 h-7 text-gray-400 hover:text-red-500"
              aria-hidden="true"
            />
          </button>
              <div className="flex-1 truncate">
              <Link to={"/eventPage" + "/" + props.event.id} state={props}>
                <div className="flex flex-col items-center space-x-3">
                {!(props.event.isOpen) && <span className="flex-shrink-0 inline-block px-2 py-0.5 text-gray-800 text-xs font-medium bg-red-100 rounded-full">
      {status}
    </span>}
                  <h3 className="text-gray-900 text-sm font-medium truncate">
                    {props.event.title}
                  </h3>
                  <p> {props.event.privacy}</p> {/* Display the event privacy here */}

                 
                  <h3 className="flex text-gray-900 text-sm font-medium truncate">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {props.event.options.length}
                  </h3>
                </div>
              </Link>
              </div>
            </div>
          </button>
        
      </div>
    </>
  );
};

export default EventCard;
