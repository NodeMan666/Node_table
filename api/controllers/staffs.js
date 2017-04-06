import { Organization, Staff, ShiftRequest, StaffAvailability } from '../models';


async function getStaffsForOrganization(req, res, next) {
    const {orgId} = req.params;
    const staffs = await Staff.find({organization: orgId});
    res.success({data: staffs});
}

async function getStaffByOrgIdAndShiftId(req, res, next) {
    const {orgId, staffId} = req.params;
    const staff = await Staff.findOne({_id: staffId, organization: orgId});
    res.success({data: staff});
}

async function deleteStaffByOrgIdAndShiftId(req, res, next) {
    const {orgId, staffId} = req.params;
    const staff = await Staff.findOne({_id: staffId, organization: orgId});
    await staff.remove();
    res.success();
}

async function createStaffWitOrgId(req, res, next) {
    const {orgId} = req.params;
    req.body.orgId = orgId;


    const staff = new Staff(req.body);
    await staff.save();
    res.success();
}

async function clockedIn(req, res, next) {
    const {orgId, staffId, eventId, positionId} = req.params;

    await ShiftRequest.findOneAndUpdate(
      {organization: orgId, user: staffId, event: eventId, position: positionId },
      {clockedIn: new Date().toISOString()},
      {upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.success();
}

async function clockedOut(req, res, next) {
    const {orgId, staffId, eventId, positionId} = req.params;

    await ShiftRequest.findOneAndUpdate(
      {organization: orgId, user: staffId, event: eventId, position: positionId },
      {clockedOut: new Date().toISOString()},
      {upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.success();
}

async function getStaffAvailability(req, res, next) {
    const {orgId, staffId} = req.params;

    const staffAvailability = await StaffAvailability.findOne({_id: staffId});
    if(staffAvailability) {
        res.success({data: staffAvailability});
    }
    else {
        return res.error('No entry', 404);
    }
}

async function postStaffAvailability(req, res, next) {
    const {orgId, staffId} = req.params;

    await StaffAvailability.findOneAndUpdate(
      {_id: staffId},
      req.body,
      {upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.success();
}

export default {
    getStaffsForOrganization: getStaffsForOrganization,
    getStaffByOrgIdAndShiftId: getStaffByOrgIdAndShiftId,
    deleteStaffByOrgIdAndShiftId: deleteStaffByOrgIdAndShiftId,
    createStaffWitOrgId: createStaffWitOrgId,
    clockedIn: clockedIn,
    clockedOut: clockedOut,
    getStaffAvailability: getStaffAvailability,
    postStaffAvailability: postStaffAvailability,
}
