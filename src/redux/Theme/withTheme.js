import { connect } from "react-redux";
import { updateTheme } from "./actions";

const mapStateToProps = ({ theme }) => ({
  appTheme: theme.appTheme
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateTheme: id => dispatch(updateTheme(id))
});

export const withTheme = Component =>
  connect(mapStateToProps, mapDispatchToProps)(Component);
