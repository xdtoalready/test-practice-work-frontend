import { loadAvatar } from "../../../core/lib/mapper.utils";

export const onMeMapper = ({ data }) => {
  data = data.data;
  return {

    data: {
      conversation_id: data.conversation_id,
      company: {
        id: data.id,
      },
      manager: {
        id: data.manager.id,
        name: [
          data.manager.last_name,
          data.manager.name,
          data.manager.middle_name,
        ]
          .filter(Boolean)
          .join(" "),
        email: 'support@lead-bro.ru',
        phone: '+73433644223',
        avatar: loadAvatar(data.manager.avatar),
      },
      id: data.id,
      managerId: data.manager.id,
      name: [
        data.manager.last_name,
        data.manager.name,
        data.manager.middle_name,
      ]
        .filter(Boolean)
        .join(" "),
      email: data.manager.email,
      avatar: loadAvatar(data.manager.avatar),
      services: data.services.filter(el=>Boolean(el.active)).map((el) => ({
        id: el.id,
        type: el.type,
        name: el.name,
        status: el.active ? "active" : "inactive",
      })),
    },
  };
};
