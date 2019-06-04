import { tryLogin } from "../helpers/auth";
import formatErrors from '../helpers/formatErrors'
import { requiresAuth } from '../helpers/permission'


export default {
    Group: {
        admin: async (parent, args, {models, user }) => {
            const groupId = parent.id
            const userId = user.id
            console.log(groupId, 'what the parent')
            const member = await models.Member.findOne({
                where: { group_id: groupId, user_id: userId}
            })
            if(!member) {
                return false
            }
            console.log(member.dataValues)
            const admin = member.dataValues.admin
            return admin
        }
    },
    User: {
        groups: async (parent, args, { models, user }) =>{
            // problem med admin har
            console.log('problem med admin field tag1', user)
            const groups = await models.sequelize.query(
                'SELECT * FROM GROUPS JOIN members AS MEMBER ON groups.id = member.group_id WHERE member.user_id = ? AND member.active = true',
                {
                replacements: [user.id],
                model: models.Group,
                raw: true,
                },
            )
            console.log(groups)

            return groups
        },
    },
    Query: {
        getUser: requiresAuth.createResolver((parent,args, { models, user }) => models.User.findOne({where: { id: user.id  } })),
        singleUser: (parent, { userId }, { models }) => models.User.findOne({
            where: { id: userId }
        }),
        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        login: (parent, {username, password}, { models, SECRET, SECRET2 }) => 
            tryLogin(username, password, models, SECRET, SECRET2),

        registerUser: async (parent, args, { models }) => {

            try {
                const createdUser = await models.User.create(args)
                return {
                    ok: true,
                    user: {
                        ...createdUser.dataValues,
                        password: null
                    }
                }

            } catch(error) {
                console.log(error)
                return {
                    ok: false,
                    errors: formatErrors(error, models )
                }
            }
        }
    }
}