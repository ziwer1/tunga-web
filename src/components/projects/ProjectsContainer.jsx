import React from 'react';
import { Switch, Route } from 'react-router-dom';

import connect from '../../connectors/ProjectConnector';

import ProjectListContainer from './ProjectListContainer';
import ProjectList from './ProjectList';
import ProjectDetailContainer from './ProjectDetailContainer';
import ProjectManagement from "./ProjectManagement";


const ProjectsContainer = ({Project, ProjectActions}) => {
    return (
        <React.Fragment>
            <Switch>
                <Route exact path="/projects/:projectId" render={props => <ProjectDetailContainer {...props} projectId={props.match.params.projectId} Project={Project} ProjectActions={ProjectActions}><ProjectManagement/></ProjectDetailContainer>}/>
                {[
                    '/project/filter/:filter',
                    '/projects',
                ].map(path => {
                    return (
                        <Route key={`project-container-path--${path}`} path={path} render={props => <ProjectListContainer {...props} Project={Project} ProjectActions={ProjectActions}><ProjectList/></ProjectListContainer>}/>
                    );
                })}
            </Switch>
        </React.Fragment>
    );
};

export default connect(ProjectsContainer);
