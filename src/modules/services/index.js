/**
 *
 * @authors liwb (you@example.org)
 * @date    2016/10/24 17:35
 * @version $ 考虑到所有的API都放到这里
 */

/* name module */
import _Axios from '../utils/_axios';

export function login(data) {
    return _Axios('/usercenter/user/mobile_login', { data });
}
