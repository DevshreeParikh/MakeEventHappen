import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import noImage from "../img/download.jpeg";
// import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

let path = "http://localhost:3001/";

const Event = () => {
  const [eventData, setEventData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  let { id } = useParams();
  let address;

  async function updateRSVP(eventId) {
    try {
      const { data } = await axios.patch(
        `http://localhost:3001/event/${eventId}`,
        { data: { page: null, userId: loggedInUser } },
        {
          headers: { Accept: "application/json" },
        }
      );
      if (data) {
        if (data.userId) setLoggedInUser(data.userId);
        setIsError(false);
        setEventData(data.event);
        setLoading(false);
      } else {
        setIsError(true);
      }
    } catch (e) {
      setIsError(true);
      setErrorMessage(e.response.data.errors);
    }
  }

  async function deleteEvent(eventId) {
    try {
      const { data } = await axios.delete(
        `http://localhost:3001/event/${eventId}`,
        { data: { page: null, userId: loggedInUser } },
        {
          headers: { Accept: "application/json" },
        }
      );
      if (data) {
        if (data.userId) setLoggedInUser(data.userId);
        setIsError(false);
        setIsDeleted(true);
        setLoading(false);
      } else {
        setIsError(true);
      }
    } catch (e) {
      setIsError(true);
      setErrorMessage(e.response.data.errors);
    }
  }

  function joinDiscussion(eventId, loggedInUser) {}

  function chatWithHost(eventId, loggedInUser) {}

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`http://localhost:3001/event/${id}`);
        if (data) {
          if (data.userId) setLoggedInUser(data.userId);
          setIsError(false);
          setEventData(data);
          setLoading(false);
        }
      } catch (e) {
        setIsError(true);
        setErrorMessage(e.response.data.errors);
      }
    }
    fetchData();
  }, [id]);

  if (isDeleted) return <Alert severity="success">{errorMessage}</Alert>;

  if (isError) return <Alert severity="error">Error! Event not found!</Alert>;

  if (eventData && eventData.address) {
    address = eventData.address;
    if (eventData.address2 && eventData.address2.length > 0)
      address = address + ", " + eventData.address2;
  } else {
    address = "No Address provided";
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <Card variant="outlined">
        <CardHeader title={eventData.name} component="div" />
        <CardMedia
          component="img"
          image={
            eventData.image // && show.thumbnail[0].path
              ? path + eventData.image
              : noImage
          }
        />

        <CardContent component="div">
          <Typography variant="body2" color="textSecondary" component="div">
            <dl>
              <dt className="title">Time :</dt>
              {eventData && eventData.time ? (
                <dd>{eventData.time}</dd>
              ) : (
                <dd>N/A</dd>
              )}
              <br />
              <dt className="title">Address:</dt>

              {eventData && eventData.address ? (
                <dd>{address}</dd>
              ) : (
                <dd>N/A</dd>
              )}
              <br />
              <dt className="title">
                Spots available :{" "}
                {eventData.seatsAvailable
                  ? eventData.seatsAvailable
                  : "No capacity Mentioned"}
              </dt>
              <br />
              <dt className="title">Description:</dt>
              <dd>{eventData.description}</dd>
            </dl>
            {loggedInUser &&
              eventData.rsvps &&
              eventData.host &&
              eventData.seatsAvailable &&
              !eventData.rsvps.includes(loggedInUser) &&
              eventData.host !== loggedInUser &&
              eventData.seatsAvailable > 0 && (
                <Button
                  variant="contained"
                  onClick={() => {
                    updateRSVP(eventData._id);
                  }}
                >
                  RSVP
                </Button>
              )}
            {loggedInUser &&
              eventData.host &&
              loggedInUser === eventData.host && (
                <div>
                  <Button
                    variant="contained"
                    onClick={() => {
                      deleteEvent(eventData._id);
                    }}
                  >
                    Delete Event
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      joinDiscussion(eventData._id, loggedInUser);
                    }}
                  >
                    Enter Discussion
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      chatWithHost(eventData._id, loggedInUser);
                    }}
                  >
                    Chat
                  </Button>
                </div>
              )}

            {loggedInUser &&
              eventData.rsvps &&
              eventData.rsvps.includes(loggedInUser) && (
                <div>
                  <Button
                    variant="contained"
                    onClick={() => {
                      chatWithHost(eventData._id, loggedInUser);
                    }}
                  >
                    Chat with Host
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      joinDiscussion(eventData._id, loggedInUser);
                    }}
                  >
                    Enter Discussion
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      updateRSVP(eventData._id, loggedInUser);
                    }}
                  >
                    Remove RSVP
                  </Button>
                </div>
              )}
            <br />
            <Link to="/events/page/0">Back to all events</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Event;