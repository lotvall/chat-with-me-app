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
            const messages = await models.Message.findAll({where: {group_id: id }})
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
                await models.Member.create({ groupId: group.id, userId: user.id, admin: true, active: true, inviter: user.id });
                

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
        inviteToGroup: requiresAuth.createResolver(async (parent, { joining, groupId }, {models, user}) => {
            // find the inviter member
            // is the inviter an admin?
            // find invitee, user to add
            // does the user exist?
            // create member
        }),

        handleGroupInvite: requiresAuth.createResolver(async (parent, { joining, groupId }, {models, user}) => {
            
            // is there a member already?
            const member = await models.Member.findOne({where: { userId: user.id, groupId}})
            if (member.active) {
                throw new Error('You are already a member of this group')
            }

            if(joining) {
                try {
                    await models.Member.update({active:true}, {where: {
                        userId: user.id, groupId
                    }})                
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
            }
            if(!joining){
                try {
                await models.User.destroy({
                    where: {
                        userId: user.id, groupId
                    }
                })
                return {
                    ok: true,
                } 
            } catch(error) {
                return {
                    ok: false,
                    errors: formatErrors(error, models)
                }
            }
            }
            
            
        }),
    },
}