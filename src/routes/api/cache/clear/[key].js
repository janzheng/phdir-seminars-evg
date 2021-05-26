
/*

	/api/cache/clear/{key}

	- please refer to api/cache/index
	- clears cache at a specific key

*/

import * as index from "./index.js";

// this gets the appropriate slug for index
export function get(req, res) {
  index.get(req, res)
}

