module.exports = (data, request) => {
  let applicant = data.applicant_details && data.applicant_details.applicant || {};
  let means = applicant.means || {}
  let provider = data.provider_details || {};
  let now = new Date();

  let defaults = {
    applicant_reference: applicant.last_name + '#' + applicant.first_name + '#' + applicant.national_insurance_number,
    application_reference: 'LAA-' + request.requestId.substring(1, 9),
    application_type: 'Initial application',
    employment_status: means.employment_status,
    provider_firm: provider.firm,
    provider_reference: provider.firm + '#' + provider.office + '#' + provider.email,
    passporting_means: means.passporting,
    application_status: request.path.includes('/submit') ? 'completed' : 'started',
    submission_date: now.toISOString(),
    submission_month: now.getFullYear() + '-' + (now.getMonth() + 1),
    version: 1
  };

  let item = Object.assign(defaults, data);

  const deleteEmptyValues = (obj) => Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  deleteEmptyValues(item);

  return item;
};
