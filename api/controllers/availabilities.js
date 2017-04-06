import { StaffAvailability } from '../models';


async function getMyAvailability(req, res, next) {
    const availability = await StaffAvailability.findOne({user: req.user._id});
    res.success({data: availability});
}

async function postMyAvailability(req, res, next) {
    const availability = await StaffAvailability.findOneAndUpdate(
      {user: req.user._id},
      req.body,
      {upsert:true, new: true}
    )

    res.success();
}



export default {
    getMyAvailability: getMyAvailability,
    postMyAvailability: postMyAvailability,
}
