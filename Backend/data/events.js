const mongoCollections = require("../config/mongoCollections");
const events = mongoCollections.events;
const { ObjectId } = require("mongodb");
const validation = require("./validation");

async function createEvent(
  title,
  description,
  time,
  capacity,
  address,
  address2,
  image
) {
  const eventCollection = await events();

  let newEvent = {
    title,
    description,
    time: time.slice(0, -7),
    capacity,
    address,
    address2,
    image,
    rsvps: [],
  };

  const insertInfo = await eventCollection.insertOne(newEvent);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { message: "Could not add event successfully", code: 500 };

  const newId = insertInfo.insertedId.toString();

  const event = await this.get(newId);
  return event;
}

async function get(id) {
  if (!id) throw { message: "You must provide an id to search for", code: 400 };
  id = validation.checkId(id);

  const eventCollection = await events();
  const event = await eventCollection.findOne({ _id: ObjectId(id) });
  if (event === null) throw { message: "No event with that id", code: 404 };

  event._id = event._id.toString();

  return event;
}

async function getAll(page = 0) {
  page = parseInt(page);

  let start = page == 0 ? 0 : (page - 1) * 20;
  //let end = start + 50 < sweetList.length ? start + 50 : sweetList.length;

  const eventCollection = await events();
  const eventList = await eventCollection
    .find({})
    .skip(start)
    .limit(start + 20)
    .toArray();

  const eventCount = await eventCollection.countDocuments();

  const numOfPages = Math.ceil(eventCount / 20);

  if (eventList.length == 0) throw { message: "No sweets", code: 404 };

  for (let indexOne = 0; indexOne < eventList.length; indexOne++) {
    eventList[indexOne]._id = eventList[indexOne]._id.toString();
  }

  let previous = page <= 0 || page > numOfPages ? null : page - 1;
  let next = page < numOfPages - 1 ? page + 1 : null;
  let data = { results: eventList, numOfPages, previous, next };
  return data;
}

async function setRsvp(eventId, userId) {
  const eventCollection = await events();
  const event = await this.get(eventId);

  if (eventId.guests.includes(userId)) {
    eventId.guests.splice(eventId.guests.indexOf(userId), 1);
  } else {
    eventId.guests.push(userId);
  }

  let newEvent = {
    title: eventId.title,
    description: eventId.description,
    time: eventId.description,
    capacity: eventId.capacity,
    address: eventId.address,
    address2: eventId.address2,
    image: eventId.image,
    rsvps: eventId.rsvps,
  };

  const updatedInfo = await eventCollection.updateOne(
    { _id: ObjectId(newEvent) },
    { $set: event }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { message: "Could not update event successfully", code: 500 };
  }

  return await this.get(eventId);
}

async function remove(eventId) {
  // if (!id) throw "You must provide an id to remove for";
  // if (typeof id !== "string") throw "Id must be a string";
  // if (id.trim().length === 0)
  //   throw "id cannot be an empty string or just spaces";
  // id = id.trim();
  // if (!ObjectId.isValid(id)) throw "invalid object ID";

  const eventCollection = await events();
  const event = await this.get(eventId);
  const deletionInfo = await bandCollection.deleteOne({
    _id: ObjectId(eventId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete event with id of ${eventId}`;
  }

  let answer = { eventId, deleted: true };
  return answer;
}

module.exports = {
  createEvent,
  get,
  getAll,
  setRsvp,
  remove,
};
