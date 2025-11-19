module.exports.refreshSession = async (req, UserModel) => {
  const user = await UserModel.findById(req.session.user.id);
  req.session.user.credits = user.credits;
};



