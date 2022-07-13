module.exports = (data, request) => {
  let applicant = data.applicant_details && data.applicant_details.applicant || {};
  let means = applicant.means || {}
  let provider = data.provider_details || {};

  let defaults = {
    application_reference: 'LAA-' + request.requestId.substring(1, 9),
    submission_date: new Date().toISOString(),
    applicant: applicant.last_name + '#' + applicant.first_name + '#' + applicant.national_insurance_number,
    provider: provider.firm + '#' + provider.office + '#' + provider.email,
    status: request.path.includes('/submit') ? 'completed' : 'started',
    application_type: 'Initial application',
    passporting_means: means.passporting,
    employment_status: means.employment_status,
    version: 1
  };

  Object.assign(defaults, data);

  const deleteEmptyValues = (obj) => Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  deleteEmptyValues(data);

  return data;
};
