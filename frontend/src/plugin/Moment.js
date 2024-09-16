import moment from "moment";

function Moment(date) {
    return moment(date).format("DD MMM YYYY, HH:mm");

}
export default Moment;
