const AFFILIATE_CODE_QUERY_PARAM = 'affiliate-code';
const AFFILIATE_CODE_FIELD_NAME = 'partner_affiliate_code';

export const saveAffiliateCode = location => {
  localStorage.removeItem(AFFILIATE_CODE_QUERY_PARAM);
  localStorage.removeItem(AFFILIATE_CODE_FIELD_NAME);

  const uRLSearchParams = new URLSearchParams(location.search);
  const affiliateCode = uRLSearchParams.get(AFFILIATE_CODE_QUERY_PARAM);
  if (!affiliateCode) {
    return;
  }
  localStorage.setItem(AFFILIATE_CODE_QUERY_PARAM, affiliateCode);
};

export const getAffiliateCode = () => {
  //   return localStorage.getItem(AFFILIATE_CODE_QUERY_PARAM);
  const affiliateCode = localStorage.getItem(AFFILIATE_CODE_QUERY_PARAM);
  return {
    ...(affiliateCode && { [AFFILIATE_CODE_FIELD_NAME]: affiliateCode }),
  };
};
export const getAffiliateCodeFillInput = () => {
  const affiliateCode = localStorage.getItem(AFFILIATE_CODE_QUERY_PARAM);
  return affiliateCode;
};

export const renderLinkAffiliate = affiliateCode => {
  const urlHost = window.location.origin;
  if (!affiliateCode) {
    return;
  } else {
    const linkAffiliate =
      urlHost + '/auth/signup?affiliate-code=' + affiliateCode;
    return linkAffiliate;
  }
};
