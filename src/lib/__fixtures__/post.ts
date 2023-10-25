const post: chrome.devtools.network.Request = {
  getContent() {},
  cache: {},
  _resourceType: "xhr",
  request: {
    method: "POST",
    url: "https://www.example.com/v1/track",
    httpVersion: "http/2.0",
    headers: [
      {
        name: ":method",
        value: "POST",
      },
      {
        name: ":path",
        value: "/v1/track",
      },
      {
        name: ":scheme",
        value: "https",
      },
      {
        name: "accept",
        value: "*/*",
      },
      {
        name: "accept-encoding",
        value: "gzip, deflate, br",
      },
      {
        name: "accept-language",
        value: "en-GB,en-US;q=0.9,en;q=0.8",
      },
      {
        name: "anonymousid",
        value: "aa",
      },
      {
        name: "authorization",
        value: "Basic aa==",
      },
      {
        name: "content-length",
        value: "6798",
      },
      {
        name: "content-type",
        value: "application/json",
      },
    ],
    queryString: [
      {
        name: "alt",
        value: "json",
      },
      {
        name: "key",
        value: "abc",
      },
    ],
    cookies: [
      {
        name: "VISITOR_INFO1_LIVE",
        value: "abc",
        path: "/",
        domain: ".example.com",
        expires: "2024-04-12T07:45:16.478Z",
        httpOnly: true,
        secure: true,
      },
      {
        name: "YSC",
        value: "abc",
        path: "/",
        domain: ".example.com",
        expires: "1969-12-31T23:59:59.000Z",
        httpOnly: true,
        secure: true,
      },
    ],
    headersSize: -1,
    bodySize: 6798,
    postData: {
      mimeType: "application/json",
      text: '{"channel":"web","context":{"app":{"name":"RudderLabs JavaScript SDK","namespace":"com.rudderlabs.javascript","version":"2.42.4"},"traits":{},"library":{"name":"RudderLabs JavaScript SDK","version":"2.42.4"},"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36","os":{"name":"","version":""},"locale":"en-GB","screen":{"density":2,"width":2560,"height":1440,"innerWidth":1246,"innerHeight":1237},"sessionId":1697355661034,"campaign":{},"page":{"path":"/Interview/Highspot-Interview-Questions-E1191772.htm","referrer":"https://www.glassdoor.co.uk/","referring_domain":"www.glassdoor.co.uk","search":"","title":"Highspot Interview Questions | Glassdoor","url":"https://www.glassdoor.co.uk/Interview/Highspot-Interview-Questions-E1191772.htm","tab_url":"https://www.glassdoor.co.uk/Interview/Highspot-Interview-Questions-E1191772.htm","initial_referrer":"$direct","initial_referring_domain":""}},"type":"track","messageId":"9c3627e3-a068-484b-a572-d99a6b505f62","originalTimestamp":"2023-10-15T07:42:54.690Z","anonymousId":"39651d9f-9367-484c-a131-578771e01dbf","userId":"","event":"module impressed","properties":{"module type":"FishbowlCarousel","hostname":"www.glassdoor.co.uk","rollup url":"/interview/interview-questions","abstract url":"/Interview/[EMP]Interview-Questions-E[EID].htm","full page url":"https://www.glassdoor.co.uk/Interview/Highspot-Interview-Questions-E1191772.htm","event origin":"module impressed","gtm container id":"GTM-PST2JZ","gtm container version":"1374","page url minus query":"www.glassdoor.co.uk/Interview/Highspot-Interview-Questions-E1191772.htm","lashed employer":"Highspot ","lashed employer id":1191772,"lashed location":"London, United Kingdom","lashed industry":"Enterprise Software & Network Solutions","lashed industry id":200061,"lashed sector":"Information Technology","lashed sector id":10013,"locale":"en-GB","user agent string":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36","asid - raw":"39651d9f-9367-484c-a131-578771e01dbf.1697355662.0","asid - clean":"39651d9f-9367-484c-a131-578771e01dbf.1697355662.0","asid - gdGlobals":"39651d9f-9367-484c-a131-578771e01dbf.1697355662.0","dos2 a/b test id list":["content_company_updates_mesh_graph.updates_mesh_PROD_test","content_demographic_tng.demographic_tng_test_cxp_5119","content_dni.CXP_4282_PROD","content_ei_fishbowl_blended_posts.CXP_3369_PROD_2023_10_11","content_ei_fishbowl_branded_cta_module.experiment_PROD","content_ei_fishbowl_carousel_cta.CXP_3369_PROD","content_ei_fishbowl_carousel_v2.EPCOMM_413_PROD_test","content_ei_fishbowl_co_reg_flow.experiment_PROD","content_ei_fishbowl_job_recommended_posts.CXP_5043_experiment_V3_PROD_20231013","content_ei_fishbowl_recommended_bowls.CXP_4824_experiment_PROD","content_ei_fishbowl_recommended_posts.CXP_4825_experiment_PROD_20230621","content_ei_header_overview_cta.EPCOMM_322_PROD_test","content_ei_header_right_rail.CXP_3365_PROD_0607","content_ei_industry_post_carousel.CXP_5178_PROD","content_ei_ner_model.CXP_5124_PROD_2023_09_12","content_ei_overview_module_rebrand.CXP_4958_PROD_2023_09_06","content_ei_ui_kit_conversion.CXP_2030_PROD_test","content_employer_reviews_graph.PROD_test","content_indeed.PROD_test","content_interviews_graph.PROD_test","content_interviews_graph_overview.CXP_4965_PROD_test","content_overview_dni_module.CXP_4900_PROD_test","content_review_highlights_ml_intl.prod_highlights_module_intl_test_081023","content_reviews_details_module.CXP_4982_PROD_20230803","content_reviews_filter_rebrand.CXP-5121_PROD_2023_09_19","content_reviews_graph.PROD_test","content_reviews_node.I18N_redirect_reviews_node_test_20190530","content_salaries_node.exp_content_salaries_catchall","content_single_page_survey.CXP_1419_PROD_test","content_survey_global_context.CON_238_PROD_test_051221","existing_users_community_registration.PROD_existing_user_community_reg_test_HARDSELL","growth_global.tng_community_june_15_20230620","growth_hardsell_wall.change_text_content_test","growth_header.exp_header_catchall","growth_jobs.g4j_l2a_post_apply_test_20211209","growth_redirect_tld.growth_redirect_tld","growth_sohp.sohp_community_video","growth_us_tech.user_activation_US_tech_initiative_exp_20220504","growth_user_activation.user_activation_post_auth_redirect_exp_20220601","growth_user_login_hfa.update_user_login_endpoint_test","interviews-proxyfree-rollout"],"dos2 a/b test treatment list":["company_updates_mesh_graph_t1","enableDemographicsTNG_t1","showDni_t1","showVariant_control","enableBrandedCtaModule_t1","showCtaVariant_t2","fishbowlCarousel_control","enableCoRegistrationFlow_t1","enableJobRecommendedPosts_t1","enableRecommendedBowls_t1","enableRecommendedPosts_t1","fishbowlCta_control","hideHeaderRightRail_t1","industryPostCarousel_control","enableNerModel_t1","enableOverviewRebrand_t1","ei_ui_t1","content_employer_reviews_graph_t1","apply_t1","interviews_os_graph_t1","interviews_os_graph_t1","hideDni_t1","enableMLHighlightsINTL_t1","enableReviewsDetailsModule_t1","enableFilterRebrand_control","apply_t1","redirect2Node_t1","showSgocCards_t5","single_page_t1","new_suggested_companies_t1","existing_user_community_reg_t1","tng_community_june_15_t1","change_text_content_t0","header_default","g4j_l2a_post_apply_t0","growth_redirect_tld_treatment","sohp_community_video_treatment","US_tech_survey_t1","post_auth_redirect_t2","update_user_login_endpoint_t1","interviews_proxyfree_t1"],"responsive design breakpoint":"default","locked state":"locked","document referrer":"https://www.glassdoor.co.uk/","domain id":2,"engaged employer status":"active","untranslated url":"https://www.glassdoor.com/Interview/Highspot-Interview-Questions-E1191772.htm","guid - event":"39651d9f-9367-484c-a131-578771e01dbf","page group":"EI-Interviews","page title":"Highspot Interview Questions | Glassdoor","page content type":"employer-info:ei-interviews","history length":4,"ip location id":"1130338","ip location type":"C","onetrust groups":"isGpcEnabled=0&datestamp=Sun+Oct+15+2023+00%3A42%3A21+GMT-0700+(Pacific+Daylight+Time)&version=202306.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=abb90842-8eee-4b06-a3b3-042e004b7b09&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0002%3A1%2CC0004%3A1%2CC0017%3A1&AwaitingReconsent=false","platform type id":3,"device type id":1,"view type id":4,"referrer data":{"currentPageRollup":"/interview/interview-questions","currentPageAbstract":"/Interview/[EMP]Interview-Questions-E[EID].htm","currentPageFull":"https://www.glassdoor.co.uk/Interview/Highspot-Interview-Questions-E1191772.htm"},"java enabled":"false","profile id":1610275},"integrations":{"All":true},"sentAt":"2023-10-15T07:42:54.694Z"}',
    },
  },
  response: {
    status: 200,
    statusText: "OK",
    httpVersion: "http/2.0",
    headers: [
      {
        name: "access-control-expose-headers",
        value: "",
      },
      {
        name: "content-length",
        value: "2",
      },
      {
        name: "content-type",
        value: "text/plain; charset=utf-8",
      },
      {
        name: "date",
        value: "Sun, 15 Oct 2023 07:42:54 GMT",
      },
      {
        name: "server",
        value: "openresty/1.21.4.2",
      },
      {
        name: "vary",
        value: "Origin",
      },
    ],
    cookies: [],
    content: {
      size: 28,
      mimeType: "application/json",
    },
    redirectURL: "",
    headersSize: -1,
    bodySize: -1,
    _transferSize: 166,
  },
  serverIPAddress: "44.219.182.139",
  startedDateTime: "2023-10-15T07:42:54.694Z",
  time: 318.07399999186396,
  timings: {
    blocked: 1.4950000001639128,
    dns: 0.010000000000000009,
    ssl: 105.26800000000001,
    connect: 203.84,
    send: 0.21299999999999386,
    wait: 112.1749999562949,
    receive: 0.341000035405159,
  },
};

export const postHost = 'www.example.com';

export default post;
