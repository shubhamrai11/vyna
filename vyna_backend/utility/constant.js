const statusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  EXPECTATION_FAILED: 417,
  INTERNAL_SERVER: 500,
};
const REGX = {
  Email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  AlphaWithSpecial: /^[a-zA-Z._^%$&#!~@, -]*$/,
  Alphabets: /^[a-zA-Z ]*$/,
  AlphabetsWithDots: /^[a-zA-Z. ]*$/,
  AlphabetsWithComma: /^[a-zA-Z, ]*$/,
  AlphabetsWithSlash: /^[a-zA-Z0-9/.& ]*$/,
  Password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[|)(@\<{}>[\]/$!%*?:;.,=&_#~"'`^+-])[A-Za-z\d|)(@\<{}>[\]/$!%*?:;.,=&_#~"'`^+-]{8,}$/,
  Pincode: /^[1-9][0-9]{5}$/,
  Alphanumeric: /^[a-zA-Z0-9]*$/,
  PositiveInt: /^\d*$/,
  IFSC: /^([A-Za-z]{4}0[A-Za-z0-9]{6})$/,
};
const userRole={
  ADMIN:'admin',
  JOBSEEKER:'jobseeker',
  RECRUITER:'recruiter'
}
const jobStatus={
  INPROGRESS:"INPROGRESS",
  PENDING:"PENDING",
  HOLD:"HOLD",
  COMPLETE:"COMPLETE"
}
module.exports = { statusCodes,userRole,REGX,jobStatus };
