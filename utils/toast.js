const Toast = (title, icon = 'none', duration, options) => {
    wx.showToast({
        title: title || '',
        icon: icon,
        image: (options && options.image) || '',
        duration: duration || 1500,
        mask: (options && options.mask) || true,
    });
}

export default Toast;