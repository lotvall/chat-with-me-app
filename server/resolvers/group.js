import formatErrors from '../helpers/formatErrors'
import { requiresAuth, requiresTeamAccess } from '../helpers/permission'

export default {
    Group: {
        members: async ({id}, args, { models }) => {
            const members = await models.Member.findAll({where: { group_id: id}}).map(el => el.get({ plain: true }))
            
            const users = members.map(async m => {
                const user = await models.User.findOne({where: { id: m.userId}})
                return user
            })
            return users
        },
        messages: async ({id}, args, { models }) => {

            // not working at the moment
            // createGroup and joinGroup is not returning messages
            // "message": "column message.group_id does not exist",
            console. log('this is being called')

            const messages = await models.Message.findAll({where: {group_id: id }})
            console. log('the messages', messages)
            return messages
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
                const group = await models.Group.create({ ...args });
                await models.Member.create({ groupId: group.id, userId: user.id, admin: true, });
                

                return {
                    ok: true,
                    group: group,
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
                const group = await models.Group.findOne({where: { id: groupId }})
                return {
                    ok: true,
                    group: group
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