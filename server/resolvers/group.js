import formatErrors from '../helpers/formatErrors'
import { requiresAuth, requiresTeamAccess } from '../helpers/permission'

export default {
    Group: {
        members: async ({id}, args, { models }) => {
            console.log('finding members of the group')
            const members = await models.Member.findAll({where: { group_id: id}}).map(el => el.get({ plain: true }))
            
            const users = members.map(async m => {
                console.log('m', m)
                const user = await models.User.findOne({where: { id: m.userId}})
                return user
            })
            console.log(users)
            return users
        }
    },
    Query: {
        getGroupMembers: requiresAuth.createResolver(async (parent, { groupId }, { models, user }) => {
                return await models.User.findAll({
                    include: [{
                        model: models.Group,
                        where: { id: groupId },
                    }]   
                }, { raw: true })
        })
    },
    Mutation: {
        createGroup: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const response = await models.sequelize.transaction(async (transaction) => {
                    const group = await models.Group.create({ ...args });
                    await models.Member.create({ groupId: group.id, userId: user.id, admin: true, });

                    return group;
                });

                return {
                    ok: true,
                    team: response,
                };
            } catch (err) {
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),

        joinGroup: requiresAuth.createResolver(async (parent, { groupId }, {models, user}) => {
            
            try {
                
                await models.Member.create({ userId: user.id, groupId})
                
                return {
                    ok: true
                } 
                
            } catch(error) {
                return {
                    ok: false,
                    errors: formatErrors(error, models)
                }
            }
        }),
    },
}