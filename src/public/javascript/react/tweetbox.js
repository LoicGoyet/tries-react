const TWEET_MAX_LENGTH = 140;
const PHOTO_LENGTH = PHOTO_LENGTH;

var TweetBox = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            photoAdded: false
        };
    },
    handleChange: function(event) {
        this.setState({ text: event.target.value });
    },
    togglePhoto: function(event) {
        this.setState({photoAdded: !this.state.photoAdded});
    },
    remainingCharacters: function() {
        if (this.state.photoAdded) {
            return TWEET_MAX_LENGTH - PHOTO_LENGTH - this.state.text.length;
        } else {
            return TWEET_MAX_LENGTH - this.state.text.length;
        }
    },
    disableTweetButton: function () {
        return this.remainingCharacters() === TWEET_MAX_LENGTH || this.remainingCharacters() < 0;
    },
    overflowAlert: function() {
        if (this.remainingCharacters() < 0) {
            const BEFORE_OVERFLOW_LENGTH = 10;

            if (this.state.photoAdded) {
                var beforeOverflowText = this.state.text.substring(TWEET_MAX_LENGTH - PHOTO_LENGTH - BEFORE_OVERFLOW_LENGTH, TWEET_MAX_LENGTH - PHOTO_LENGTH);
                var overflowText = this.state.text.substring(TWEET_MAX_LENGTH - PHOTO_LENGTH);
            } else {
                var beforeOverflowText = this.state.text.substring(TWEET_MAX_LENGTH - BEFORE_OVERFLOW_LENGTH, TWEET_MAX_LENGTH);
                var overflowText = this.state.text.substring(TWEET_MAX_LENGTH);
            }

            return (
                <div className="alert alert-warning">
                    <strong>Oops ! Too Long:</strong>
                    &nbsp;...{beforeOverflowText}
                    <strong class="bg-danger">{overflowText}</strong>
                </div>
            );
        } else {
            return '';
        }
    },
    render: function() {
        return (
            <div className="well clearfix">
                { this.overflowAlert() }
                <textarea className="form-control"
                          onChange={this.handleChange}></textarea>
                <br/>
                <span>{ this.remainingCharacters() }</span>
                <button className="btn btn-primary pull-right"
                        disabled={this.disableTweetButton()}>Tweet</button>
                <button className="btn btn-default pull-right"
                        onClick={this.togglePhoto}>
                    {this.state.photoAdded ? "✓ Photo Added" : "Add Photo"}
                </button>
            </div>
        );
    }
});

ReactDOM.render(
    <TweetBox />,
    document.getElementById("container")
);
