import { Organization, Event } from '../models';


async function getEventsForOrganization(req, res, next) {
    const {orgId} = req.params;
    const events = await Event.find({organization: orgId});
    res.success({data: events});
}

async function getEventByOrgIdAndEventId(req, res, next) {
    const {orgId, eventId} = req.params;
    const event = await Event.findOne({_id: eventId, organization: orgId});
    res.success({data: event});
}

async function deleteEventByOrgIdAndEventId(req, res, next) {
    const {orgId, eventId} = req.params;
    const event = await Event.findOne({_id: eventId, organization: orgId});
    await event.remove();
    res.success();
}

async function createEventWitOrgId(req, res, next) {
    const {orgId} = req.params;
    req.body.organization = orgId;

    const event = new Event(req.body);
    await event.save();
    res.success({data: event});
}

async function updateEventByOrgIdAndEventId(req, res, next) {
    const {orgId, eventId} = req.params;
    const event = await Event.findOneAndUpdate({_id: eventId, organization: orgId}, req.body, {new: true});
    res.success({data: event});
}

export default {
    getEventsForOrganization: getEventsForOrganization,
    getEventByOrgIdAndEventId: getEventByOrgIdAndEventId,
    deleteEventByOrgIdAndEventId: deleteEventByOrgIdAndEventId,
    createEventWitOrgId: createEventWitOrgId,
    updateEventByOrgIdAndEventId: updateEventByOrgIdAndEventId,
}
