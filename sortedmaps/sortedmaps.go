package sortedmap

import (
	"encoding/json"
	"sort"
)

// SortedMap holds the sorted key-value pairs
type SortedMap struct {
	Keys   []string
	Values map[string]interface{}
}

// UnmarshalJSON custom unmarshaller for SortedMap
func (sm *SortedMap) UnmarshalJSON(data []byte) error {
	var temp map[string]interface{}
	if err := json.Unmarshal(data, &temp); err != nil {
		return err
	}

	sm.Values = temp
	sm.Keys = make([]string, 0, len(temp))

	for key := range temp {
		sm.Keys = append(sm.Keys, key)
	}
	sort.Strings(sm.Keys)
	return nil
}

// MarshalJSON custom marshaller for SortedMap
func (sm SortedMap) MarshalJSON() ([]byte, error) {
	m := make(map[string]interface{})
	for _, key := range sm.Keys {
		m[key] = sm.Values[key]
	}
	return json.Marshal(m)
}
