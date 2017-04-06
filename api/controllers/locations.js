import { Organization, Location } from '../models';


async function getLocationsForOrganization(req, res, next) {
    const {orgId} = req.params;
    const locations = await Location.find({organization: orgId});
    res.success({data: locations});
}

async function getLocationByOrgIdAndLocationId(req, res, next) {
    const {orgId, locationId} = req.params;
    const location = await Location.findOne({_id: locationId, organization: orgId});
    res.success({data: location});
}

async function deleteLocationByOrgIdAndLocationId(req, res, next) {
    const {orgId, locationId} = req.params;
    const location = await Location.findOne({_id: locationId, organization: orgId});
    await location.remove();
    res.success();
}

async function updateLocationByOrgIdAndLocationId(req, res, next) {
    const {orgId, locationId} = req.params;
    const location = await Location.findOneAndUpdate({_id: locationId, organization: orgId}, req.body, {new: true});
    res.success({data: location});
}

async function createLocationWitOrgId(req, res, next) {
    const {orgId} = req.params;
    if(!req.body.name) {
        return res.error('Missing required fields');
    }

    req.body.organization = orgId;
    const location = new Location(req.body);
    await location.save();
    res.success({data: location});
}

export default {
    getLocationsForOrganization: getLocationsForOrganization,
    getLocationByOrgIdAndLocationId: getLocationByOrgIdAndLocationId,
    deleteLocationByOrgIdAndLocationId: deleteLocationByOrgIdAndLocationId,
    createLocationWitOrgId: createLocationWitOrgId,
    updateLocationByOrgIdAndLocationId: updateLocationByOrgIdAndLocationId,
}
