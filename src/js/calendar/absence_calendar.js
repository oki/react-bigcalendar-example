import React from 'react'
import BigCalendar from 'react-big-calendar'
import Event from './event'
import CustomToolbar from './custom_toolbar'
import CustomModal from './custom_modal'

class AbsenceCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        open: false,
      }
    };

    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onOpenModal(slotInfo) {

    console.log("slotInfo:");
    console.log(slotInfo);

    let driver_id = (slotInfo.driver && slotInfo.driver.id) || this.props.drivers[0].id;

    this.setState({ modal: {
      open: true,
      start: slotInfo.start,
      end: slotInfo.end,
      driver_id: driver_id,
      absence_id: slotInfo.id,
      type: "holiday",
    }});
  }

  onCloseModal() {
    this.setState({ modal: { open: false }});
    this.props.handleUpdate();
  }

  changeDate(date) {
    this.props.loadEvents({ date: this.props.selected_date })
  }

  eventStyle(event) {
    let color = event.type === "l4" ? "#24a01d" : "#50a8d4";

    return {
      style: { backgroundColor: color }
    }
  }

  render() {
    const { events } = this.props;
    const { modal } = this.state;

    return([
      <BigCalendar
        selectable
        popup
        culture="pl"
        events={events}
        views={['month']}
        step={60}
        showMultiDayTimes
        defaultDate={this.props.selected_date}
        onSelectEvent={this.onOpenModal}
        onSelectSlot={this.onOpenModal}
        eventPropGetter={ (event,start,end,isSelected) => this.eventStyle(event) }
        components={{
          event: Event,
          toolbar: CustomToolbar(this.props)
        }}
        messages={{
          showMore: total => `+${total} więcej`
        }}
      />,
      <CustomModal
        modal={modal}
        drivers={this.props.drivers}
        onClose={this.onCloseModal}
        />
      ]
    )
  }
}

export default AbsenceCalendar;
