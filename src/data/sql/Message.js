/*
 *
 * Database layout for Chat Message History
 *
 */

import Sequelize, { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import Channel from './Channel';
import RegUser from './RegUser';

const Message = sequelize.define('Message', {
  // Message ID
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },

  message: {
    type: `${DataTypes.CHAR(200)} CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    allowNull: false,
  },
}, {
  updatedAt: false,

  setterMethods: {
    message(value) {
      this.setDataValue('message', value.slice(0, 200));
    },
  },
});

Message.belongsTo(Channel, {
  as: 'channel',
  foreignKey: 'cid',
  onDelete: 'cascade',
});

Message.belongsTo(RegUser, {
  as: 'user',
  foreignKey: 'uid',
  onDelete: 'cascade',
});

export async function storeMessage(
  name,
  flag,
  message,
  cid,
  uid,
) {
  await Channel.update({
    lastMessage: Sequelize.literal('CURRENT_TIMESTAMP'),
  }, {
    where: {
      id: cid,
    },
  });
  return Message.create({
    name,
    flag,
    message,
    cid,
    uid,
  });
}

export async function getMessagesForChannel(cid, limit) {
  const models = await Message.findAll({
    attributes: [
      'message',
      'uid',
    ],
    include: {
      model: RegUser,
      as: 'user',
      foreignKey: 'uid',
      attributes: ['name', 'flag'],
    },
    where: { cid },
    limit,
    order: [['createdAt', 'DESC']],
    raw: true,
  });
  const messages = [];
  let i = models.length;
  while (i > 0) {
    i -= 1;
    const {
      message,
      uid,
      'user.name': name,
      'user.flag': flag,
      ts,
    } = models[i];
    messages.push([
      name,
      message,
      flag,
      uid,
      ts,
    ]);
  }
  return messages;
}

export default Message;
