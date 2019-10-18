
//if useHAId is passed in as true, the HierarchyAttributeId will be used as the value
export default function filterLookupDataByKey(data, hierarchy, key, value, useHAId = false) {
    return data[hierarchy]
        .filter(hierAttrs => hierAttrs.key === key)
        .map(ha => ({
            value: useHAId ? ha.hierarchyAttributeId : ha.value, 
            label: ha.value, 
            selected: ha.value === value ? true : false  
        }));
}