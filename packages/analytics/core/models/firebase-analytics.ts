import { z } from 'zod';
import { loginProviderSchema } from './auth';

const fbLogEventClickEventSchema = z.object({
  name: z.literal('click_event'),
  params: z.object({
    event_id: z.string(),
  }),
});
const fbLogEventVisitEventDetailSchema = z.object({
  name: z.literal('visit_event_detail'),
  params: z.object({
    event_id: z.string(),
  }),
});
const fbLogEventClickFindTicketSchema = z.object({
  name: z.literal('click_find_ticket'),
  params: z.object({
    seller_name: z.string(),
    url: z.string(),
  }),
});
export const fbLogEventLoginSchema = z.object({
  name: z.literal('login'),
  params: z.object({
    provider: loginProviderSchema,
    user_id: z.string(),
  }),
});
export const fbLogEventLogoutSchema = z.object({
  name: z.literal('logout'),
  params: z.object({}),
});
export const fbLogEventClickHomeCollectionSchema = z.object({
  name: z.literal('click_home_collection'),
  params: z.object({
    event_id: z.string(),
  }),
});
export const fbLogEventClickSurveyFloatingButtonSchema = z.object({
  name: z.literal('click_survey_floating_button'),
  params: z.object({}),
});
export const fbLogEventClickOpenSearchBarSchema = z.object({
  name: z.literal('click_open_search_bar'),
  params: z.object({}),
});
export const fbLogEventSearchSchema = z.object({
  name: z.literal('search'),
  params: z.object({
    keyword: z.string(),
  }),
});
export const fbLogEventClickHeaderMenuSchema = z.object({
  name: z.literal('click_header_menu'),
  params: z.object({
    menu_item: z.string(),
  }),
});
export const fbLogEventClickFindOwnerButtonSchema = z.object({
  name: z.literal('click_find_owner_button'),
  params: z.object({
    venue_name: z.string(),
  }),
});
export const fbLogEventClickRecommendedEventSchema = z.object({
  name: z.literal('click_recommended_event'),
  params: z.object({
    event_id: z.string(),
  }),
});
export const fbLogEventClickVenueSchema = z.object({
  name: z.literal('click_venue'),
  params: z.object({
    venue_id: z.string(),
    venue_name: z.string(),
  }),
});
export const fbLogEventClickEmailPopupAgreeSchema = z.object({
  name: z.literal('click_email_popup_agree'),
  params: z.object({}),
});
export const fbLogEventClickEmailPopupCloseSchema = z.object({
  name: z.literal('click_email_popup_close'),
  params: z.object({}),
});
export const fbLogEventClickEmailPopupRejectSchema = z.object({
  name: z.literal('click_email_popup_reject'),
  params: z.object({}),
});
export const fbLogEventClickEmojiRsvpSchema = z.object({
  name: z.literal('click_emoji_rsvp'),
  params: z.object({
    emoji: z.string(),
    event_id: z.string(),
  }),
});
export const fbLogEventClickTonightShowSchema = z.object({
  name: z.literal('click_tonight_show'),
  params: z.object({
    event_id: z.string(),
    city_name: z.string(),
  }),
});
export const fbLogEventClickNewShowSchema = z.object({
  name: z.literal('click_new_show'),
  params: z.object({
    event_id: z.string(),
  }),
});
export const fbLogEventClickFindTicketModalSchema = z.object({
  name: z.literal('click_find_ticket_modal'),
  params: z.object({
    event_slug: z.string(),
  }),
});
export const fbLogEventClickShareButtonSchema = z.object({
  name: z.literal('click_share_button'),
  params: z.object({
    type: z.enum(['twitter', 'facebook', 'copy-link', 'more']),
    url: z.string().optional(),
  }),
});
export const fbLogEventClickRsvpActionButtonSchema = z.object({
  name: z.literal('click_rsvp_action_button'),
  params: z.object({
    event_id: z.string(),
    emoji: z.string(),
  }),
});
export const fbLogEventClickNavigateToRsvpSchema = z.object({
  name: z.literal('click_navigate_to_rsvp'),
  params: z.object({
    event_id: z.string(),
  }),
});
export const fbLogEventClickVenueInEventDetail = z.object({
  name: z.literal('click_venue_in_event_detail'),
  params: z.object({
    venue_id: z.string(),
    event_id: z.string(),
  }),
});
export const fbLogEventClickRecommendedMoreEventsSchema = z.object({
  name: z.literal('click_recommended_more_events'),
  params: z.object({
    location_city_name: z.string(),
    event_category_name: z.string(),
  }),
});
export const fbLogEventClickRecommendedEventDiscoverSchema = z.object({
  name: z.literal('click_recommended_event_discover'),
  params: z.object({
    location_city_name: z.string(),
    event_category_name: z.string(),
  }),
});
export const fbLogEventClickRecentEventsSchema = z.object({
  name: z.literal('click_recent_events'),
  params: z.object({
    event_id: z.string(),
  }),
});
export const fbLogEventFeedPageViewSchema = z.object({
  name: z.literal('feed_page_view'),
  params: z.object({}),
});
export const fbLogEventLiveEventsPageView = z.object({
  name: z.literal('live_events_page_view'),
  params: z.object({}),
});
export const fbLogEventClickFeedItem = z.object({
  name: z.literal('click_feed_item'),
  params: z.object({
    event_slug: z.string(),
  }),
});
export const fbLogEventClickOpenFeedSearchLocationCity = z.object({
  name: z.literal('click_open_feed_search_location_city'),
  params: z.object({}),
});
export const fbLogEventClickOpenFeedSearchGenre = z.object({
  name: z.literal('click_open_feed_search_genre'),
  params: z.object({}),
});
export const fbLogEventClickFeedSearchLocationCityItem = z.object({
  name: z.literal('click_feed_search_location_city_item'),
  params: z.object({
    locationCity: z.string(),
  }),
});
export const fbLogEventClickFeedSearchGenreItem = z.object({
  name: z.literal('click_feed_search_genre_item'),
  params: z.object({
    genre: z.string(),
  }),
});
export const fbLogEventClickSetFeedLocationCity = z.object({
  name: z.literal('click_set_feed_location_city'),
  params: z.object({
    locationCity: z.string(),
  }),
});
export const fbLogEventClickSetFeedGenres = z.object({
  name: z.literal('click_set_feed_genres'),
  params: z.object({
    genresString: z.string(),
  }),
});
export const fbLogEventClickDiscoverFeed = z.object({
  name: z.literal('click_discover_feed'),
  params: z.object({
    ui: z.union([
      z.literal('event-detail'),
      z.literal('ticket-cta-detail-modal'),
    ]),
  }),
});

const fbLogEventSchema = z.discriminatedUnion('name', [
  fbLogEventClickEventSchema,
  fbLogEventVisitEventDetailSchema,
  fbLogEventClickFindTicketSchema,
  fbLogEventLoginSchema,
  fbLogEventLogoutSchema,
  fbLogEventClickHomeCollectionSchema,
  fbLogEventClickSurveyFloatingButtonSchema,
  fbLogEventClickOpenSearchBarSchema,
  fbLogEventSearchSchema,
  fbLogEventClickHeaderMenuSchema,
  fbLogEventClickFindOwnerButtonSchema,
  fbLogEventClickRecommendedEventSchema,
  fbLogEventClickVenueSchema,
  fbLogEventClickEmailPopupAgreeSchema,
  fbLogEventClickEmailPopupCloseSchema,
  fbLogEventClickEmailPopupRejectSchema,
  fbLogEventClickEmojiRsvpSchema,
  fbLogEventClickTonightShowSchema,
  fbLogEventClickNewShowSchema,
  fbLogEventClickFindTicketModalSchema,
  fbLogEventClickShareButtonSchema,
  fbLogEventClickRsvpActionButtonSchema,
  fbLogEventClickNavigateToRsvpSchema,
  fbLogEventClickVenueInEventDetail,
  fbLogEventClickRecommendedMoreEventsSchema,
  fbLogEventClickRecommendedEventDiscoverSchema,
  fbLogEventClickRecentEventsSchema,
  fbLogEventFeedPageViewSchema,
  fbLogEventClickFeedItem,
  fbLogEventClickOpenFeedSearchLocationCity,
  fbLogEventClickOpenFeedSearchGenre,
  fbLogEventClickFeedSearchLocationCityItem,
  fbLogEventClickFeedSearchGenreItem,
  fbLogEventClickSetFeedLocationCity,
  fbLogEventClickSetFeedGenres,
  fbLogEventClickDiscoverFeed,
  fbLogEventLiveEventsPageView,
]);
export type FBLogEvent = z.infer<typeof fbLogEventSchema>;
