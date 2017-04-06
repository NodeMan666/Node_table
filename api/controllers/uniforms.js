import { Organization, Uniform } from '../models';


async function getUniformsForOrganization(req, res, next) {
    const {orgId} = req.params;
    const uniforms = await Uniform.find({organization: orgId});
    res.success({data: uniforms});
}

async function getUniformByOrgIdAndLocationId(req, res, next) {
    const {orgId, uniformId} = req.params;
    const uniform = await Uniform.findOne({_id: uniformId, organization: orgId});
    res.success({data: uniform});
}

async function deleteUniformByOrgIdAndLocationId(req, res, next) {
    const {orgId, uniformId} = req.params;
    const uniform = await Uniform.findOne({_id: uniformId, organization: orgId});
    await uniform.remove();
    res.success();
}

async function createUniformWitOrgId(req, res, next) {
    const {orgId} = req.params;
    if(!req.body.uniformName) {
        return res.error('Missing required fields');
    }

    req.body.organization = orgId;
    const uniform = new Uniform(req.body);
    await uniform.save();
    res.success({data: uniform});
}

async function updateUniformByOrgIdAndUniformId(req, res, next) {
    const {orgId, uniformId} = req.params;
    const uniform = await Uniform.findOneAndUpdate({_id: uniformId, organization: orgId}, req.body, {new: true});
    res.success({data: uniform});
}


export default {
    getUniformsForOrganization: getUniformsForOrganization,
    getUniformByOrgIdAndLocationId: getUniformByOrgIdAndLocationId,
    deleteUniformByOrgIdAndLocationId: deleteUniformByOrgIdAndLocationId,
    createUniformWitOrgId: createUniformWitOrgId,
    updateUniformByOrgIdAndUniformId: updateUniformByOrgIdAndUniformId,
}
