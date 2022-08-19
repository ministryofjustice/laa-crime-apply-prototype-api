module.exports = (data, request) => {
  let client = data.client_details && data.client_details.client || {};
  let means = client.means || {}
  let provider = data.provider_details || {};
  let now = new Date().toISOString();

  let defaults = {
    client_reference: client.last_name + '#' + client.first_name + '#' + client.national_insurance_number,
    application_reference: 'LAA-' + request.requestId.substring(1, 9),
    application_type: 'Initial application',
    employment_status: means.employment_status,
    provider_firm: provider.firm,
    provider_reference: provider.firm + '#' + provider.office + '#' + provider.email,
    passporting_means: means.passporting,
    application_status: request.path.includes('/submit') ? 'completed' : 'started',
    submission_date: now,
    submission_month: now.substring(0, 7),
    version: 1
  };

  let item = Object.assign(defaults, data);

  const deleteEmptyValues = (obj) => Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  deleteEmptyValues(item);

  return item;
};
