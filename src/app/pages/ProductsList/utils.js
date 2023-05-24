import { cloneDeep, isEmpty } from 'lodash';

export const numberOfVariation = (has_variation, variations) => {
  return has_variation
    ? variations.filter(v => v.status === 'active').length
    : 1;
};
export const handleAttributesInForm = (
  listAttributes,
  platform,
  attributes,
) => {
  const newAttributes = cloneDeep(listAttributes);
  for (let [key, item] of listAttributes.entries()) {
    const nameByPlatform =
      platform === 'shopee' ? 'original_attribute_name' : 'name';
    if (attributes[item[nameByPlatform]]) {
      newAttributes[key].value = attributes[item[nameByPlatform]];
      if (
        item.format_type === 'QUANTITATIVE' &&
        !isEmpty(item.attribute_unit)
      ) {
        newAttributes[key].attribute_value_list = [
          item.attribute_unit.slice(-1).pop(),
        ];
      }
    }
  }
  return newAttributes;
};
export const convertExtraAttributesToAttributes = (platform, arr = []) => {
  if (platform === 'shopee') {
    console.log(
      'convertExtraAttributesToAttributes :>> ',
      arr,
      arr.reduce((final, item) => {
        final[item.original_attribute_name] = item.value;
        return final;
      }, {}),
    );
    return arr.reduce((final, item) => {
      final[item.original_attribute_name] = item.value;
      return final;
    }, {});
  }
  return arr.reduce((final, item) => {
    final[item.name] = item.value;
    return final;
  }, {});
};
