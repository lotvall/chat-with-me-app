import { requiresTeamAccess, requiresAuth } from '../helpers/permission'
import { withFilter } from 'apollo-server'

const NEW_GROUP_MESSAGE = "NEW_CHANNEL_MESSAGE"

export default {
    
    Message: {
        url: parent => {
            return parent.url ? `http://localhost:8080/uploads/${parent.url}` : parent.url
        },
        user: ({ user, userId }, args, { models }) => {
            if(user) return user
            return models.User.findOne({where: { id: userId }})
        }
    },

    Query: {
        messages: requiresAuth.createResolver(async (parent, { cursor, groupId }, {models, user}) => {
            // const group = await models.Group.findOne({raw: true, where: {id: groupId}})

            const member = await models.Member.findOne({raw: true, where: { groupId, userId: user.id }})
            if(!member) {
                throw new Error ('Not Authorized')
            }
            const options = {
                order: [['created_at', 'DESC']], 
                where: { groupId }, 
                limit: 35, 
            }

            // find all elements after the cursor
            if (cursor){
                options.where.created_at = {
                    [models.op.lt]: cursor,
                }
            }
            const messages = await models.Message.findAll(options, { raw: true })

            if(messages.length === 0){
                return {
                    cursor: null,
                    messages: []
                }
            }

            console.log('cursor', messages)
            return {
                cursor: '' + messages[messages.length-1].createdAt,
                messages: messages.map(message => {
                    return {
                        ...message.dataValues,
                        created_at: '' + message.dataValues.createdAt,
                    }
                })
            }
                
        })
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, { file , ...args }, { models, user }) => {
          try {
            const messageData = args
            if (file) {

                const { createReadStream, filename, mimetype, encoding } = await file
                messageData.filetype = mimetype
                messageData.url = filename
                const stream = createReadStream()
                //storeFS(stream, filename)   
            }
            const message = await models.Message.create({
                ...messageData,
                userId: user.id,
            });

            

            // actually save the message here


                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        }),
    },
}