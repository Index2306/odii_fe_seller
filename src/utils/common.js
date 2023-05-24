import { uniqBy, isEmpty } from 'lodash';

export const getCategoriesTikTok = async () => {
  return fetch(`${window.location.origin}/categories_full.json`).then(
    // return fetch(`http://localhost:3001/categories_full.json`).then(
    async response => {
      return await response.json().then(categories => {
        const leafCtgs = categories.filter(ctg => ctg.is_leaf);
        const parentCtgs = categories.filter(ctg => !ctg.is_leaf);

        return uniqBy(
          leafCtgs.map(ctg => {
            let parents = [];
            let curParent = ctg.parent_id;
            while (curParent) {
              const parent = parentCtgs.find(ctg => ctg.id === curParent);
              if (parent) {
                parents.push(parent);
                curParent = parent.parent_id === '0' ? null : parent.parent_id;
              } else {
                curParent = null;
              }
            }

            return {
              display_path: [
                ...parents
                  .sort((a, b) => a.parent_id - b.parent_id)
                  .map(ctg => `${ctg.local_display_name}`),
                `${ctg.local_display_name}`,
              ].join(' / '),
              ...ctg,
              name: ctg.display_name,
              display_name: ctg.display_name,
              shop_cat_id: ctg.id,
            };
          }),
          'display_path',
        );
      });
    },
  );
};

export const checkSecurityCode = () => {
  // Ignore this case when security code is empty
  if (isEmpty(process.env.REACT_APP_SECURITY_CODE)) return true;
  const securityCodeStorage = localStorage.getItem('securityCode');

  return securityCodeStorage === process.env.REACT_APP_SECURITY_CODE;
};
