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
        }),
        getPublicGroups: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            return await models.Group.findAll({where:{ public_group: true}})
        }),
        getPendingGroupInvites: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            const pendingMemberships = await models.Member.findAll({where: {userId: user.id, active: false } }).map(m => m.dataValues)

            console.log('pending members', pendingMemberships) 

            const groupInvites = pendingMemberships.map(async m => {
                const group = await models.Group.findOne({where: { id : m.groupId }})
                console.log(group.dataValues)

                const inviter = await models.User.findOne({where: { id: m.inviter }})
                return {
                    group: group.dataValues,
                    inviter: inviter ? inviter.dataValues : null
                }
            })
            // 3 
            console.log('groupInvites, returns 3 promises', groupInvites)

            const retValue = await Promise.all(groupInvites)

            console.log('retvalue', retValue)

            return retValue
        }),
    },
    Mutation: {
        createGroup: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const group = await models.Group.create({ ...args });
                await models.Member.create({ groupId: group.id, userId: user.id, admin: true, active: true, inviter: user.id });
                
                return {
                    ok: true,
                    group: {
                        ...group.dataValues,
                        public_group: group.dataValues.publicGroup
                    },
                };
            } catch (err) {
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),
        joinPublicGroup: requiresAuth.createResolver(async (parent, { groupId }, {models, user}) => {

            // is there a group?

            // need to 

            const group = await models.Group.findOne({where: {id: groupId}}, {raw: true})
            console.log(group)
            if(!group) {
                throw new Error('No such group exists')
            }
            if(!group.dataValues.publicGroup) {
                throw new Error('The group is not public')
            }

            const member = await models.Member.findOne({where: { userId: user.id, groupId}})
            if (!!member) {
                throw new Error('You are already a member of this group')
            }
            try {
                await models.Member.create({ groupId: group.id, userId: user.id, admin: false, active: false, inviter: null });

                return {
                    ok: true,
                    group: {
                        ...group.dataValues,
                        public_group: group.dataValues.publicGroup
                    }
                }


            }catch(error) {

            }
        }),

        inviteToGroup: requiresAuth.createResolver(async (parent, { groupId, userId }, {models, user}) => {

            // find the inviter member
            // is there an inviter member
            // is the inviter an admin?
            // find invitee, user to add
            // does the user exist?
            // create member

            const inviterMember = await models.Member.findOne({where: {userId : user.id, groupId }}, {raw: true})
            
            const inviteeUser = await models.User.findOne({where: { id: userId }})

            const inviteeMember = await models.Member.findOne({where: {userId, groupId}})

            if(!inviterMember.dataValues) {
                throw new Error('You are not a member of the group')

            }
            if (!inviterMember.dataValues.admin) {
                throw new Error('You are not authorized to invite members to the group')
            }

            if (!inviteeUser.dataValues) {
                throw new Error('There is no such user')
            }

            if (inviteeMember && inviteeMember.active) {
                throw new Error('The user is already a member of the group')
            }

            if (inviteeMember && !inviteeMember.active) {
                throw new Error('The user has already been invited to the group')
            }

            const newMember = models.Member.create({ groupId, userId, admin: false, active: false, inviter: user.id })

            console.log(newMember)

            return true

            
        }),

        handleGroupInvite: requiresAuth.createResolver(async (parent, { joining, groupId }, {models, user}) => {
            // is there a group?

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