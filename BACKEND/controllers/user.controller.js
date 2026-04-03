import * as model from './../models/user.model.js'
import v2 from './../lib/cloudinary.js'

export async function updateProfile(req, res) {
    const { name } = req.body;
    const avatar = req.file;
    const userId = req.userId;

    if (!avatar?.buffer) {
        return res.status(400).json({ message: 'Avatar is required' });
    }

    const uploadResult = await new Promise((resolve, reject) => {
        v2.uploader.upload_stream({ format: 'png', resource_type: 'image' }, (err, result) => {
            if (err) return reject(err);
            if (!result?.url) return reject(new Error('Cloudinary upload failed'));
            resolve(result);
        }).end(avatar.buffer);
    });

    let newUser = await model.updateProfile(userId, name, uploadResult.url);
    return res.json({ user: newUser, message: "profile updated successfuly" });
}