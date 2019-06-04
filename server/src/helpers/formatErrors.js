import _ from 'lodash'

export default (e, models) => {
    // needed to capitalize Sequelize to get this to work.
    if(e instanceof models.Sequelize.ValidationError) {
        return e.errors.map(x => _.pick(x, ['path', 'message']))
    }
    return [{path: 'name', message: 'something went wrong'}]
}