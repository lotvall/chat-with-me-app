import { requiresAuth } from '../helpers/permission'
import { PubSub, withFilter } from 'apollo-server'
import storeFS from '../helpers/storeFS'
import shortid from 'shortid'

const NEW_GROUP_MESSAGE = "NEW_GROUP_MESSAGE"

const pubsub = new PubSub()

export default {
    
    Message: {
        url: (parent, args, {serverUrl}) => {
            return parent.url ? `http://${serverUrl}/uploads/${parent.url}` : parent.url
        },
        user: ({ user, userId }, args, { models }) => {
            if(user) return user
            return models.User.findOne({where: { id: userId }})
        }
    },
    Subscription: {
        newGroupMessage: {
          subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_GROUP_MESSAGE),
                (payload, args, { user }) => {
                    return payload.groupId === args.groupId;
                })
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
            console.log(messageData)

            if (file) {

                const { createReadStream, filename, mimetype, encoding } = await file
                const id = shortid.generate()
                const url = `${id}-${filename}`
                console.log(url)
                messageData.filetype = mimetype
                messageData.url = url
                const stream = createReadStream()
                console.log(messageData)
                storeFS(stream, url)   
            }
            const message = await models.Message.create({
                ...messageData,
                userId: user.id,
            });
            
            pubsub.publish(NEW_GROUP_MESSAGE, {
                groupId: args.groupId,
                newGroupMessage: {
                  ...message.dataValues,
                  user,
                  created_at: '' + message.dataValues.createdAt,
                },
              });

                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        }),
    },
}