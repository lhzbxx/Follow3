package cn.jpush.phonegap;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import __PACKAGE_NAME__.R;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import cn.jpush.android.api.BasicPushNotificationBuilder;
import cn.jpush.android.api.CustomPushNotificationBuilder;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;
import cn.jpush.android.data.JPushLocalNotification;

public class JPushPlugin extends CordovaPlugin {
    private final static List<String> methodList =
            Arrays.asList(
                    "addLocalNotification",
                    "clearAllNotification",
                    "clearLocalNotifications",
                    "clearNotificationById",
                    "getNotification",
                    "getRegistrationID",
                    "init",
                    "isPushStopped",
                    "onPause",
                    "onResume",
                    "requestPermission",
                    "removeLocalNotification",
                    "reportNotificationOpened",
                    "resumePush",
                    "setAlias",
                    "setBasicPushNotificationBuilder",
                    "setCustomPushNotificationBuilder",
                    "setDebugMode",
                    "setLatestNotificationNum",
                    "setPushTime",
                    "setTags",
                    "setTagsWithAlias",
                    "setSilenceTime",
                    "setStatisticsOpen",
                    "stopPush"
            );

    private ExecutorService threadPool = Executors.newFixedThreadPool(1);
    private static JPushPlugin instance;
    private static Activity cordovaActivity;
    private static String TAG = "JPushPlugin";

    private static boolean shouldCacheMsg = false;
    private static boolean isStatisticsOpened = false;    // 是否开启统计分析功能

    public static String notificationTitle;
    public static String notificationAlert;
    public static Map<String, Object> notificationExtras = new HashMap<String, Object>();

    public static String openNotificationTitle;
    public static String openNotificationAlert;
    public static Map<String, Object> openNotificationExtras = new HashMap<String, Object>();

    public JPushPlugin() {
        instance = this;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        Log.i(TAG, "---------------- initialize" + "-" + openNotificationAlert
                + "-" + notificationAlert);

        cordovaActivity = cordova.getActivity();

        //如果同时缓存了打开事件 openNotificationAlert 和 消息事件 notificationAlert，只向 UI 发打开事件。
        //这样做是为了和 iOS 统一。
        if (openNotificationAlert != null) {
            notificationAlert = null;
            transmitNotificationOpen(openNotificationTitle, openNotificationAlert,
                    openNotificationExtras);
        }
        if (notificationAlert != null) {
            transmitNotificationReceive(notificationTitle, notificationAlert,
                    notificationExtras);
        }
    }

    public void onPause(boolean multitasking) {
        Log.i(TAG, "----------------  onPause");
        shouldCacheMsg = true;
        if (isStatisticsOpened && multitasking) {
            JPushInterface.onPause(this.cordova.getActivity());
        }
    }

    public void onResume(boolean multitasking) {
        shouldCacheMsg = false;
        Log.i(TAG, "---------------- onResume" + "-" + openNotificationAlert
                + "-" + notificationAlert);
        if (isStatisticsOpened && multitasking) {
            JPushInterface.onResume(this.cordova.getActivity());
        }
        if (openNotificationAlert != null) {
            notificationAlert = null;
            transmitNotificationOpen(openNotificationTitle, openNotificationAlert,
                    openNotificationExtras);
        }
        if (notificationAlert != null) {
            transmitNotificationReceive(notificationTitle, notificationAlert,
                    notificationExtras);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        cordovaActivity = null;
        instance = null;
    }

    private static JSONObject getMessageObject(String message,
            Map<String, Object> extras) {
        JSONObject data = new JSONObject();
        try {
            data.put("message", message);
            JSONObject jExtras = new JSONObject();
            for (Entry<String, Object> entry : extras.entrySet()) {
                if (entry.getKey().equals("cn.jpush.android.EXTRA")) {
                    JSONObject jo = null;
                    if (TextUtils.isEmpty((String) entry.getValue())) {
                        jo = new JSONObject();
                    } else {
                        jo = new JSONObject((String) entry.getValue());
                        String key;
                        Iterator keys = jo.keys();
                        while (keys.hasNext()) {
                            key = keys.next().toString();
                            jExtras.put(key, jo.getString(key));
                        }
                    }
                    jExtras.put("cn.jpush.android.EXTRA", jo);
                } else {
                    jExtras.put(entry.getKey(), entry.getValue());
                }
            }
            if (jExtras.length() > 0) {
                data.put("extras", jExtras);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return data;
    }

    private static JSONObject getNotificationObject(String title,
            String alert, Map<String, Object> extras) {
        JSONObject data = new JSONObject();
        try {
            data.put("title", title);
            data.put("alert", alert);
            JSONObject jExtras = new JSONObject();
            for (Entry<String, Object> entry : extras.entrySet()) {
                if (entry.getKey().equals("cn.jpush.android.EXTRA")) {
                    JSONObject jo = null;
                    if (TextUtils.isEmpty((String) entry.getValue())) {
                        jo = new JSONObject();
                    } else {
                        jo = new JSONObject((String) entry.getValue());
                        String key;
                        Iterator keys = jo.keys();
                        while (keys.hasNext()) {
                            key = keys.next().toString();
                            jExtras.put(key, jo.getString(key));
                        }
                    }
                    jExtras.put("cn.jpush.android.EXTRA", jo);
                } else {
                    jExtras.put(entry.getKey(), entry.getValue());
                }
            }
            if (jExtras.length() > 0) {
                data.put("extras", jExtras);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return data;
    }

    static void transmitMessageReceive(String message, Map<String, Object> extras) {
        if (instance == null) {
            return;
        }
        JSONObject data = getMessageObject(message, extras);
        String format = "window.plugins.jPushPlugin.receiveMessageInAndroidCallback(%s);";
        final String js = String.format(format, data.toString());
        cordovaActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                instance.webView.loadUrl("javascript:" + js);
            }
        });
    }

    static void transmitNotificationOpen(String title, String alert,
            Map<String, Object> extras) {
        if (instance == null) {
            return;
        }
        JSONObject data = getNotificationObject(title, alert, extras);
        String format = "window.plugins.jPushPlugin.openNotificationInAndroidCallback(%s);";
        final String js = String.format(format, data.toString());
        cordovaActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                instance.webView.loadUrl("javascript:" + js);
            }
        });
        JPushPlugin.openNotificationTitle = null;
        JPushPlugin.openNotificationAlert = null;
    }

    static void transmitNotificationReceive(String title, String alert,
            Map<String, Object> extras) {
        if (instance == null) {
            return;
        }
        JSONObject data = getNotificationObject(title, alert, extras);
        String format = "window.plugins.jPushPlugin.receiveNotificationInAndroidCallback(%s);";
        final String js = String.format(format, data.toString());
        cordovaActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                instance.webView.loadUrl("javascript:" + js);
            }
        });
        JPushPlugin.notificationTitle = null;
        JPushPlugin.notificationAlert = null;
    }

    @Override
    public boolean execute(final String action, final JSONArray data,
            final CallbackContext callbackContext) throws JSONException {
        if (!methodList.contains(action)) {
            return false;
        }
        threadPool.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = JPushPlugin.class.getDeclaredMethod(action,
                            JSONArray.class, CallbackContext.class);
                    method.invoke(JPushPlugin.this, data, callbackContext);
                } catch (Exception e) {
                    Log.e(TAG, e.toString());
                }
            }
        });
        return true;
    }

    void init(JSONArray data, CallbackContext callbackContext) {
        JPushInterface.init(this.cordova.getActivity().getApplicationContext());
    }

    void setDebugMode(JSONArray data, CallbackContext callbackContext) {
        boolean mode;
        try {
            mode = data.getBoolean(0);
            JPushInterface.setDebugMode(mode);
            callbackContext.success();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    void stopPush(JSONArray data, CallbackContext callbackContext) {
        JPushInterface.stopPush(this.cordova.getActivity().getApplicationContext());
        callbackContext.success();
    }

    void resumePush(JSONArray data, CallbackContext callbackContext) {
        JPushInterface.resumePush(this.cordova.getActivity().getApplicationContext());
        callbackContext.success();
    }

    void isPushStopped(JSONArray data, CallbackContext callbackContext) {
        boolean isStopped = JPushInterface.isPushStopped(
                this.cordova.getActivity().getApplicationContext());
        if (isStopped) {
            callbackContext.success(1);
        } else {
            callbackContext.success(0);
        }
    }

    void setLatestNotificationNum(JSONArray data, CallbackContext callbackContext) {
        int num = -1;
        try {
            num = data.getInt(0);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error("error reading num json");
        }
        if (num != -1) {
            JPushInterface.setLatestNotificationNumber(
                    this.cordova.getActivity().getApplicationContext(), num);
        } else {
            callbackContext.error("error num");
        }
    }

    void setPushTime(JSONArray data, CallbackContext callbackContext) {
        Set<Integer> days = new HashSet<Integer>();
        JSONArray dayArray;
        int startHour = -1;
        int endHour = -1;
        try {
            dayArray = data.getJSONArray(0);
            for (int i = 0; i < dayArray.length(); i++) {
                days.add(dayArray.getInt(i));
            }
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error("error reading days json");
        }
        try {
            startHour = data.getInt(1);
            endHour = data.getInt(2);
        } catch (JSONException e) {
            callbackContext.error("error reading hour json");
        }
        Context context = this.cordova.getActivity().getApplicationContext();
        JPushInterface.setPushTime(context, days, startHour, endHour);
        callbackContext.success();
    }

    void getRegistrationID(JSONArray data, CallbackContext callbackContext) {
        Context context = this.cordova.getActivity().getApplicationContext();
        String regID = JPushInterface.getRegistrationID(context);
        callbackContext.success(regID);
    }

    void onResume(JSONArray data, CallbackContext callbackContext) {
        JPushInterface.onResume(this.cordova.getActivity());
    }

    void onPause(JSONArray data, CallbackContext callbackContext) {
        JPushInterface.onPause(this.cordova.getActivity());
    }

    void reportNotificationOpened(JSONArray data, CallbackContext callbackContext) {
        try {
            String msgID;
            msgID = data.getString(0);
            JPushInterface.reportNotificationOpened(this.cordova.getActivity(), msgID);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    void setTags(JSONArray data, CallbackContext callbackContext) {
        try {
            HashSet<String> tags = new HashSet<String>();
            for (int i = 0; i < data.length(); i++) {
                tags.add(data.getString(i));
            }
            JPushInterface.setTags(this.cordova.getActivity().getApplicationContext(),
                    tags, mTagWithAliasCallback);
            callbackContext.success();
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error("Error reading tags JSON");
        }
    }

    void setAlias(JSONArray data, CallbackContext callbackContext) {
        try {
            String alias = data.getString(0);
            JPushInterface.setAlias(this.cordova.getActivity().getApplicationContext(),
                    alias, mTagWithAliasCallback);
            callbackContext.success();
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error("Error reading alias JSON");
        }
    }

    void setTagsWithAlias(JSONArray data, CallbackContext callbackContext) {
        HashSet<String> tags = new HashSet<String>();
        String alias;
        try {
            alias = data.getString(0);
            JSONArray tagsArray = data.getJSONArray(1);
            for (int i = 0; i < tagsArray.length(); i++) {
                tags.add(tagsArray.getString(i));
            }
            JPushInterface.setAliasAndTags(this.cordova.getActivity().getApplicationContext(),
                    alias, tags, mTagWithAliasCallback);
            callbackContext.success();
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error("Error reading tagAlias JSON");
        }
    }

    void setBasicPushNotificationBuilder(JSONArray data,
            CallbackContext callbackContext) {
        BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(
                this.cordova.getActivity());
        builder.developerArg0 = "Basic builder 1";
        JPushInterface.setPushNotificationBuilder(1, builder);
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", 1);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    void setCustomPushNotificationBuilder(JSONArray data,
            CallbackContext callbackContext) {
        CustomPushNotificationBuilder builder = new CustomPushNotificationBuilder(
                this.cordova.getActivity(), R.layout.test_notification_layout,
                R.id.icon, R.id.title, R.id.text);
        builder.developerArg0 = "Custom Builder 1";
        JPushInterface.setPushNotificationBuilder(2, builder);
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", 2);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    void clearAllNotification(JSONArray data, CallbackContext callbackContext) {
        JPushInterface.clearAllNotifications(this.cordova.getActivity());
    }

    void clearNotificationById(JSONArray data, CallbackContext callbackContext) {
        int notificationId = -1;
        try {
            notificationId = data.getInt(0);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error("error reading id json");
        }
        if (notificationId != -1) {
            JPushInterface.clearNotificationById(this.cordova.getActivity(), notificationId);
        } else {
            callbackContext.error("error id");
        }
    }

    void addLocalNotification(JSONArray data, CallbackContext callbackContext)
            throws JSONException {
        int builderId = data.getInt(0);
        String content = data.getString(1);
        String title = data.getString(2);
        int notificationID = data.getInt(3);
        int broadcastTime = data.getInt(4);
        String extrasStr = data.isNull(5) ? "" : data.getString(5);
        JSONObject extras = new JSONObject();
        if (!extrasStr.isEmpty()) {
            extras = new JSONObject(extrasStr);
        }

        JPushLocalNotification ln = new JPushLocalNotification();
        ln.setBuilderId(builderId);
        ln.setContent(content);
        ln.setTitle(title);
        ln.setNotificationId(notificationID);
        ln.setBroadcastTime(System.currentTimeMillis() + broadcastTime);
        ln.setExtras(extras.toString());

        JPushInterface.addLocalNotification(this.cordova.getActivity(), ln);
    }

    void removeLocalNotification(JSONArray data, CallbackContext callbackContext)
            throws JSONException {
        int notificationID = data.getInt(0);
        JPushInterface.removeLocalNotification(this.cordova.getActivity(), notificationID);
    }

    void clearLocalNotifications(JSONArray data, CallbackContext callbackContext) {
        JPushInterface.clearLocalNotifications(this.cordova.getActivity());
    }

    /**
     * 决定是否启用统计分析功能。
     */
    void setStatisticsOpen(JSONArray data, CallbackContext callbackContext) {
        try {
            isStatisticsOpened = data.getBoolean(0);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 设置通知静默时间
     * http://docs.jpush.io/client/android_api/#api_5
     */
    void setSilenceTime(JSONArray data, CallbackContext callbackContext) {
        try {
            int startHour = data.getInt(0);
            int startMinute = data.getInt(1);
            int endHour = data.getInt(2);
            int endMinute = data.getInt(3);
            if (!isValidHour(startHour) || !isValidMinute(startMinute)) {
                callbackContext.error("开始时间数值错误");
                return;
            }
            if (!isValidHour(endHour) || !isValidMinute(endMinute)) {
                callbackContext.error("结束时间数值错误");
                return;
            }
            JPushInterface.setSilenceTime(this.cordova.getActivity(), startHour, startMinute,
                    endHour, endMinute);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error("error: reading json data.");
        }
    }

    private boolean isValidHour(int hour) {
        return !(hour < 0 || hour > 23);
    }

    private boolean isValidMinute(int minute) {
        return !(minute < 0 || minute > 59);
    }

    /**
     * 用于 Android 6.0 以上系统申请权限，具体可参考：
     * http://docs.Push.io/client/android_api/#android-60
     */
    void requestPermission(JSONArray data, CallbackContext callbackContext) {
        JPushInterface.requestPermission(this.cordova.getActivity());
    }

    private final TagAliasCallback mTagWithAliasCallback = new TagAliasCallback() {
        @Override
        public void gotResult(int code, String alias, Set<String> tags) {
            if (instance == null) {
                return;
            }
            JSONObject data = new JSONObject();
            try {
                data.put("resultCode", code);
                data.put("tags", tags);
                data.put("alias", alias);
                final String jsEvent = String.format(
                        "cordova.fireDocumentEvent('jpush.setTagsWithAlias',%s)",
                        data.toString());
                cordova.getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        instance.webView.loadUrl("javascript:" + jsEvent);
                    }
                });
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    };

}
