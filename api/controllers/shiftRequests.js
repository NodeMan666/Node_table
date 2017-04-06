import { Organization, Shift, ShiftRequest } from '../models';


async function getShiftsForOrganization(req, res, next) {
    const {orgId} = req.params;
    const shifts = await Shift.find({organization: orgId});
    res.success({data: shifts});
}

async function getShiftByOrgIdAndShiftId(req, res, next) {
    const {orgId, shiftId} = req.params;
    const shift = await Shift.findOne({_id: shiftId, organization: orgId});
    res.success({data: shift});
}

async function deleteShiftByOrgIdAndShiftId(req, res, next) {
    const {orgId, shiftId} = req.params;
    const shift = await Shift.findOne({_id: shiftId, organization: orgId});
    await ShiftRequest.remove({shift: shift._id});
    await shift.remove();
    res.success();
}

async function createShiftWitOrgId(req, res, next) {
    const {orgId} = req.params;
    req.body.orgId = orgId;

    const shift = new Shift(req.body);
    await shift.save();
    res.success();
}

async function publishByShiftId(req, res, next) {
    const {orgId, shiftId} = req.params;
    const shift = await Shift.findOne({_id: shiftId, organization: orgId});
    const shiftRequests = await ShiftRequest.find({organization: orgId, shift: shiftId});

    res.success();
}


export default {
    getShiftsForOrganization: getShiftsForOrganization,
    getShiftByOrgIdAndShiftId: getShiftByOrgIdAndShiftId,
    deleteShiftByOrgIdAndShiftId: deleteShiftByOrgIdAndShiftId,
    createShiftWitOrgId: createShiftWitOrgId,
    publishByShiftId: publishByShiftId,
}
