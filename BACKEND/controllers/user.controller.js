import * as model from './../models/user.model.js'
import v2 from './../lib/cloudinary.js'

export async function updateProfile(req, res) {

    const { name } = req.body;
    const avatar = req.file;
    const userId = req.userId;


    let update = {
        name,
        userId
    }
    if (avatar) {
        const uploadResult = await new Promise((resolve, reject) => {
            v2.uploader.upload_stream({ format: 'png', resource_type: 'image' }, (err, result) => {
                if (err) return reject(err);
                if (!result?.url) return reject(new Error('Cloudinary upload failed'));
                resolve(result);
            }).end(avatar.buffer);
        });
        update.url = uploadResult.url;
    }

    let newUser = await model.updateProfile(update);
    return res.json({ user: newUser, message: "profile updated successfuly" });
}