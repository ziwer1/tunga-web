import React from 'react'
import _ from 'underscore'
import connect from '../utils/connectors/SkillSelectionConnector'

class SkillSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {skill: ''};
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.handleGetSuggestions = _.debounce(this.handleGetSuggestions, 250);
    }

    componentDidMount() {
        const { SkillSelectionActions, skills } = this.props;
        SkillSelectionActions.invalidateSkillSuggestions();
        SkillSelectionActions.clearSkillSelections();

        if(skills && Array.isArray(skills)) {
            skills.forEach((skill) => {
                SkillSelectionActions.addSkillSelection(skill.name);
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { SkillSelection, onChange } = this.props;
        if(prevProps.SkillSelection.selected != this.props.SkillSelection.selected) {
            if(onChange) {
                onChange(SkillSelection.selected);
            }
        }
    }

    handleSkillChange(e) {
        const { SkillSelectionActions } = this.props;
        var skill = e.target.value;
        this.setState({skill: skill});
        if (e.key === 'Enter') {
            e.preventDefault();
            this.handleSelectSkill(skill);
        }
        if (!skill) {
            SkillSelectionActions.invalidateSkillSuggestions();
            return;
        }
        this.handleGetSuggestions();
    }

    handleGetSuggestions() {
        const { SkillSelectionActions } = this.props;
        SkillSelectionActions.getSkillSuggestions({search: this.state.skill});
    }

    handleSelectSkill(skill) {
        const { SkillSelectionActions } = this.props;
        SkillSelectionActions.addSkillSelection(skill);
        SkillSelectionActions.invalidateSkillSuggestions();
        this.setState({skill: ''});
    }

    handleRemoveSkill(skill) {
        const { SkillSelectionActions } = this.props;
        SkillSelectionActions.removeSkillSelection(skill);
    }

    handleComponentClick(e) {
        e.stopPropagation();
    }

    render() {
        const { SkillSelection } = this.props;

        return (
            <div className="form-group skill-selector tag-selector" onClick={this.handleComponentClick.bind(this)}>
                <div className="selections">
                    {SkillSelection.selected.map((skill) => {
                        return (
                        <div key={skill} className="list-group-item selected-item">
                            {skill}
                            <a onClick={this.handleRemoveSkill.bind(this, skill)} className="close">
                                <i className="fa fa-remove"/>
                            </a>
                        </div>)
                        })}
                </div>
                <div className="input-group">
                    <span className="input-group-addon"><i className="fa fa-tags"/></span>
                    <input type="text" className="form-control" placeholder="Type here to get suggestions or Press enter to add a new skill"
                           onChange={this.handleSkillChange}
                           onKeyPress={this.handleSkillChange}
                           value={this.state.skill}/>
                </div>

                <div className="list-group suggestions">
                    {SkillSelection.isValid?SkillSelection.suggestions.map((skill) => {
                        return (<a className="list-group-item" key={skill.id}
                                   onClick={this.handleSelectSkill.bind(this, skill.name)}>{skill.name}</a>)
                        }):''}
                </div>
            </div>
        );
    }
}

export default connect(SkillSelector);
