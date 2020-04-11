let regular = {};
regular.wx = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
regular.qq = /^[1-9]\d{4,9}$/;
regular.phone = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/;
regular.email = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
export default regular;
