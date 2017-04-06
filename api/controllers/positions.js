import { Organization, Position } from '../models';


async function getPositionsForOrganization(req, res, next) {
    const {orgId} = req.params;
    const positions = await Position.find({organization: orgId});
    res.success({data: positions});
}

async function getPositionByOrgIdAndPositionId(req, res, next) {
    const {orgId, positionId} = req.params;
    const position = await Position.findOne({_id: positionId, organization: orgId});
    res.success({data: position});
}

async function deletePositionByOrgIdAndPositionId(req, res, next) {
    const {orgId, positionId} = req.params;
    const position = await Position.findOne({_id: positionId, organization: orgId});
    await position.remove();
    res.success();
}

async function createPositionWitOrgId(req, res, next) {
    const {orgId} = req.params;
    if(!req.body.positionName) {
        return res.error('Missing required fields');
    }

    req.body.organization = orgId;
    const position = new Position(req.body);
    await position.save();
    res.success({data: position});
}

async function updatePositionByOrgIdAndPositionId(req, res, next) {
    const {orgId, positionId} = req.params;
    const position = await Position.findOneAndUpdate({_id: positionId, organization: orgId}, req.body, {new: true});
    res.success({data: position});
}


export default {
    getPositionsForOrganization: getPositionsForOrganization,
    getPositionByOrgIdAndPositionId: getPositionByOrgIdAndPositionId,
    deletePositionByOrgIdAndPositionId: deletePositionByOrgIdAndPositionId,
    createPositionWitOrgId: createPositionWitOrgId,
    updatePositionByOrgIdAndPositionId: updatePositionByOrgIdAndPositionId,
}
