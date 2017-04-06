import { Organization, Event, Admin } from '../models';

async function getOrganizationById(req, res, next) {
    const {orgId} = req.params;
    const organization = await Organization.findById(orgId);
    res.success({data: organization});
}

async function updateOrganizationById(req, res, next) {
    const {orgId} = req.params;
    const organization = await Organization.findByIdAndUpdate(orgId, req.body, {new: true});
    res.success({ data: organization});
}

async function createOrganization(req, res, next) {
    const organization = new Organization(req.body);
    await organization.save();

    const admin = new Admin({user: req.user._id, organization: organization, superAdmin: true});
    await admin.save();

    res.success({data: organization});
}

export default {
    getOrganizationById: getOrganizationById,
    updateOrganizationById: updateOrganizationById,
    createOrganization: createOrganization,
}
